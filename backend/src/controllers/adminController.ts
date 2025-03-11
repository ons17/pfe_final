import { Request, Response } from 'express';
import sql from 'mssql';
import bcrypt from 'bcrypt';

export const createEmployee = async (req: Request, res: Response) => {
  try {
    // Validate input data
    const { nom, prenom, email, mot_de_passe, role } = req.body;

    // Validate if all required fields are present
    if (!nom || !prenom || !email || !mot_de_passe || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role is one of the allowed values
    const validRoles = ['manager', 'employee', 'hr']; // Define your valid roles
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

    // Use the existing db config from your server.ts
    const pool = await sql.connect({
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      server: process.env.DB_SERVER!,
      database: process.env.DB_NAME!,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    });

    // Check if employee with this email already exists
    const checkEmail = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT TOP 1 * FROM Employees WHERE email = @email');
    
    if (checkEmail.recordset.length > 0) {
      return res.status(409).json({ message: 'Employee with this email already exists' });
    }

    // Insert the employee into the database
    await pool.request()
      .input('nom', sql.VarChar, nom)
      .input('prenom', sql.VarChar, prenom)
      .input('email', sql.VarChar, email)
      .input('mot_de_passe', sql.VarChar, hashedPassword)
      .input('role', sql.VarChar, role)
      .query('INSERT INTO Employees (nom, prenom, email, mot_de_passe, role) VALUES (@nom, @prenom, @email, @mot_de_passe, @role)');

    // Return success response (without exposing password)
    res.status(201).json({ 
      message: 'Employee created successfully',
      employee: {
        nom,
        prenom,
        email,
        role
      }
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Error creating employee', error: (error as Error).message });
  }
};

// Add a function to get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const pool = await sql.connect({
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      server: process.env.DB_SERVER!,
      database: process.env.DB_NAME!,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    });

    const result = await pool.request()
      .query('SELECT id, nom, prenom, email, role, created_at FROM Employees'); // Exclude password

    res.status(200).json({ employees: result.recordset });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error: (error as Error).message });
  }
};