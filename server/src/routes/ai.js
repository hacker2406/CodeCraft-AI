import express from "express";
import protect from "../middleware/authMiddleware.js";
import { chatWithLLM } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", protect, chatWithLLM);

export default router;