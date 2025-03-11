import express, { Request, Response } from 'express';
import sql from 'mssql';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Ons17082001',
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || 'pfe',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Create an Express router for admin routes
const router = express.Router();

// Route to create a worker account
router.post('/creer-travailleur', async (req: Request, res: Response) => {
  console.log(req.body); // Log the request body
  const { nom, prenom, email, mot_de_passe, role } = req.body;

 // Check if all fields are provided
 if (!nom || !prenom || !email || !mot_de_passe || !role) {
  return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
}

// Validate email format
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ message: 'L\'email n\'est pas valide' });
}

// Verify if the role is valid
const rolesAutorises = ['travailleur', 'admin'];
if (!rolesAutorises.includes(role)) {
  return res.status(400).json({ message: 'Le rôle est invalide' });
}

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const mot_de_passeHache = await bcrypt.hash(mot_de_passe, salt);

    // Connect to the database
    const pool = await sql.connect(dbConfig);

    // Check if email is already used
    const userCheck = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM travailleurs WHERE email = @email');

    if (userCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé' });
    }

    
    // Insert the new worker
    const result = await pool.request()
      .input('nom', sql.VarChar, nom)
      .input('prenom', sql.VarChar, prenom)
      .input('email', sql.VarChar, email)
      .input('mot_de_passe', sql.VarChar, mot_de_passeHache)
      .input('role', sql.VarChar, role)
      .query('INSERT INTO travailleurs (nom, prenom, email, mot_de_passe, role) OUTPUT INSERTED.ID VALUES (@nom, @prenom, @email, @mot_de_passe, @role)');

    // Get the ID of the inserted row
    const travailleurId = result.recordset[0].ID;

    // Return success message
    return res.status(201).json({ message: 'Travailleur créé avec succès', id: travailleurId });

  } catch (err) {
    console.error('Erreur lors de la création du compte travailleur:', err);
    return res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
});

export default router;
