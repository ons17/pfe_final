import session from 'express-session';

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'default_secret_key', // clé secrète provenant de .env
  resave: false,
  saveUninitialized: true
};
