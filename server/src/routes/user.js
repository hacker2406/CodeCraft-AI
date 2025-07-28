import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({
    user: req.user,
    message: "Protected route accessed successfully",
  });
});

export default router;