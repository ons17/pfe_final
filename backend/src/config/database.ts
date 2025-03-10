import sql from "mssql";

const dbConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!.split(",")[0], // Supprime le port ici
  port: parseInt(process.env.DB_PORT!) || 1433, // Port défini dans .env
  database: process.env.DB_NAME!,
  options: {
    encrypt: true, // True si Azure, false sinon
    trustServerCertificate: true,
  },
};

export const pool = new sql.ConnectionPool(dbConfig);
export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("✅ Connexion réussie à SQL Server !");
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données :", error);
  }
};
