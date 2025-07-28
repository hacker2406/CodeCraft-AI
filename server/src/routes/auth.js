import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Email/password routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); // Optional (client clears JWT)

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // Issue JWT for API authentication
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Redirect to frontend with token as query param
    res.redirect(`http://localhost:3000/session?token=${token}`);
  }
);

export default router;