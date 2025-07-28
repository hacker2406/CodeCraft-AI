import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import redis from "./config/redis.js"; // Import Upstash Redis instance
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js"; // Import user routes
import sessionRoutes from "./routes/session.js";
import session from "express-session";
import passport from "./config/passport.js";
import aiRoutes from "./routes/ai.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://code-craft-ai-zeta.vercel.app"
    ], 
    credentials: true,
  })
);
app.use(helmet());

// Connect to MongoDB
connectDB();

// No need to connect Redis manually with Upstash REST API

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // Use user routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, redis };