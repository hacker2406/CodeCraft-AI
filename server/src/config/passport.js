import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

console.log("--- PASSPORT CONFIGURATION ---");
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CALLBACK URL FROM ENV:", process.env.GOOGLE_CALLBACK_URL);
const effectiveCallbackURL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:5000/api/auth/google/callback`;
console.log("EFFECTIVE CALLBACK URL:", effectiveCallbackURL);
console.log("----------------------------");
// --- END DEBUGGING BLOCK ---


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: effectiveCallbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find user by googleId first
        let user = await User.findOne({ googleId: profile.id });
        // If not found, try to find by email
        if (!user) {
          user = await User.findOne({ email: profile.emails?.[0]?.value });
        }
        // If still not found, create new user
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value || "",
          });
        } else if (!user.googleId) {
          // If user exists but doesn't have googleId, add it
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;