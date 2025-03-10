import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import sql from 'mssql';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import './auth'; // Import Google OAuth configuration
import { body, validationResult } from 'express-validator';
import adminuserRouter from './routes/adminuser';


dotenv.config();

const app = express();


console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_PORT:", process.env.DB_PORT);

// Update your connection code to explicitly use port 1433
const dbConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  port: 1433, // Explicitly set to 1433 for SQL Server
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Make sure SQL Server is actually running on your machine
// You can verify this using SQL Server Configuration Manager

// Middleware pour vérifier si l'utilisateur est authentifié
function isLoggedIn(req: any, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// Test de connexion à la base de données
const testDatabaseConnection = async () => {
  try {
    await sql.connect(dbConfig);
    console.log('Connexion à la base de données réussie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  }
};

// Home route (réponse simple)
app.get('/', (req: Request, res: Response) => {
  res.send("Bienvenue sur l'API d'authentification");
});

// Routes Google OAuth
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account'
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

// Route protégée
app.get('/protected', isLoggedIn, (req: any, res: Response) => {
  res.json({ message: `Bienvenue ${req.user.displayName || req.user.email}` });
});

// Déconnexion
app.get('/logout', (req: any, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) return next(err);
    req.session.destroy((err: Error) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.json({ message: "Déconnexion réussie" });
    });
  });
});

// Echec de l'authentification Google
app.get('/auth/google/failure', (req: Request, res: Response) => {
  res.status(401).json({ message: "Échec de l'authentification Google" });
});

// Route de connexion (POST)
app.post('/login', [
  body('email').isEmail().withMessage('Format de l’email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
], async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM users WHERE email = ${email}`;
    const user = result.recordset[0];

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Vérification du mot de passe avec bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.login(user, (err: any) => {
        if (err) return next(err);
        res.json({ message: "Connexion réussie", user });
      });
    } else {
      res.status(401).json({ message: 'Mot de passe invalide' });
    }
  } catch (err) {
    next(err);
  }
});


app.use('/admin', adminuserRouter);

// Lancer le serveur
app.listen(8000, () => {
  console.log('Server running on port 8000');
});
