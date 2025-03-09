import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Google OAuth2 credentials from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// Vérification des variables d'environnement
console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET);

// Configure the Google strategy for Passport
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true
},
function(request: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
  console.log("Profile received:", JSON.stringify(profile, null, 2)); // Debug log

  // The email is typically found in profile.emails[0].value
  const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  
  console.log("User email:", userEmail); // Debug log

  // Only authorize the specific email
  if (userEmail === 'onssbenamara3@gmail.com') {
    return done(null, profile);
  } else {
    return done(null, false, { message: 'You are not authorized to access this application.' });
  }
}));

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;
