// server.ts

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import sql from 'mssql';
import dotenv from 'dotenv';
import './auth';  // Import passport configuration
import { body, validationResult } from 'express-validator';
import adminRoutes from './routes/adminuser';
import cors from 'cors';  // Import cors


dotenv.config();

const app = express();
// CORS configuration - Allow requests from Vue frontend
app.use(cors({
  origin: 'http://localhost:5173',  // Default Vue dev server port
  credentials: true  // Important for cookies/sessions
}));
app.use(express.json());  // Make sure to add this to parse JSON bodies
// Middleware for body parsing and session management
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/admin', adminRoutes);

const dbConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433, // Ensure the port is correctly assigned
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// Current user endpoint for frontend authentication state
app.get('/api/current-user', (req: any, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ 
      isAuthenticated: true, 
      user: req.user 
    });
  } else {
    res.json({ 
      isAuthenticated: false, 
      user: null 
    });
  }
});


// Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],  // This should include the 'profile' and 'email' scopes
    prompt: 'select_account'
  })
);


app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/auth/google/failure'
  }),

  (req: Request, res: Response) => {
    // Redirect to the frontend URL instead of server route
    res.redirect('http://localhost:5173/admin/dashboard');
  }
);

app.get('/auth/google/failure', (req: Request, res: Response) => {
  res.status(401).json({ message: "Authentication failed. Please try again." });
});


app.get('/auth/google/failure', (req: Request, res: Response) => {
  res.status(401).json({ message: "Authentication failed" });
});

// Middleware to check if the logged-in user is an admin
function isAdmin(req: any, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.emails[0].value === 'onssbenamara3@gmail.com') {
    return next();
  }
  res.status(403).json({ message: 'Access forbidden: Admin only' });
}

// Protected Admin Route
app.get('/admin/dashboard', isAdmin, (req: any, res: Response) => {
  res.send('Welcome to the admin dashboard');
});

// Logout Route
app.get('/logout', (req: any, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) return next(err);
    req.session.destroy((err: Error) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.json({ message: "Successfully logged out" });
    });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
