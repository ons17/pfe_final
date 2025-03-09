import express, { Request, Response } from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';

// Créer un routeur Express pour les routes d'administration
const router = express.Router();

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'sa',  // Remplacez par votre utilisateur MySQL
  password: 'Ons17082001',  // Remplacez par votre mot de passe MySQL
  database: 'pfe'  // Remplacez par le nom de votre base de données
});

// Vérification de la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion réussie à la base de données MySQL');
});

// Route pour créer un compte travailleur
router.post('/creer-travailleur', async (req: Request, res: Response) => {
  const { nom, prenom, email, mot_de_passe, role } = req.body;

  // Vérifier si tous les champs sont fournis
  if (!nom || !prenom || !email || !mot_de_passe || !role) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  // Vérifier si le rôle est valide
  const rolesAutorises = ['travailleur', 'admin'];
  if (!rolesAutorises.includes(role)) {
    return res.status(400).json({ message: 'Le rôle est invalide' });
  }

  // Hacher le mot de passe
  const salt = await bcrypt.genSalt(10);
  const mot_de_passeHache = await bcrypt.hash(mot_de_passe, salt);

  // Vérifier si l'email est déjà utilisé
  db.query('SELECT * FROM travailleurs WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la vérification de l\'email' });
    }
    
    // Vérification si le résultat est un tableau (pour les requêtes SELECT)
    if (Array.isArray(results) && results.length > 0) {
      return res.status(400).json({ message: 'L\'email est déjà utilisé' });
    }

    // Préparer la requête SQL pour insérer un nouveau travailleur
    const query = 'INSERT INTO travailleurs (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)';
    
    // Exécuter la requête pour insérer l'utilisateur dans la base de données
    db.query(query, [nom, prenom, email, mot_de_passeHache, role], (err, results) => {
      if (err) {
        console.error('Erreur lors de la création du compte travailleur:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      // Utiliser la propriété `insertId` dans `results` qui est un `OkPacket`
      const travailleurId = (results as mysql.OkPacket).insertId;
      
      // Répondre avec un message de succès
      return res.status(201).json({ message: 'Travailleur créé avec succès', id: travailleurId });
    });
  });
});

export default router;
