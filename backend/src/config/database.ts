import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Fonction pour établir la connexion à la base de données
export const createConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Connexion à la base de données réussie');
    return pool;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    throw error;
  }
};
