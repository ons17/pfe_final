import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Google OAuth2 credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// Database configuration
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

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true
},
async function(request: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
  const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

  if (userEmail === 'onssbenamara3@gmail.com') {
    // Check if the user already exists in the database
    try {
      await sql.connect(dbConfig);  // Use dbConfig here
      const result = await sql.query`SELECT * FROM users WHERE email = ${userEmail}`;
      const user = result.recordset[0];

      // If the user does not exist, insert them into the database
      if (!user) {
        await sql.query`INSERT INTO users (email, displayName, role) VALUES (${userEmail}, ${profile.displayName}, 'admin')`;
        console.log('Admin user added to the database');
      }

      // Return user to be serialized into session
      return done(null, profile);
    } catch (err) {
      console.error('Error accessing database:', err);
      return done(err, false, { message: 'Database error' });
    }
  } else {
    return done(null, false, { message: 'You are not authorized to access this application.' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;
