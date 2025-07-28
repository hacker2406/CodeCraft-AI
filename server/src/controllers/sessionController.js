import Session from "../models/Session.js";
import redis from "../config/redis.js";
import mongoose from "mongoose";

export const createSession = async (req, res) => {
  try {
    const session = await Session.create({
      user: req.user._id,
      name: req.body.name,
      data: req.body.data || {},
    });
    // Cache the session in Redis
    try {
      await redis.set(`session:${session._id}`, JSON.stringify(session));
      await redis.del(`sessions:user:${req.user._id}`);
      console.log(`[Redis] Session cached and session list invalidated for user ${req.user._id}`);
    } catch (redisErr) {
      console.warn("[Redis] Failed to cache session or invalidate session list:", redisErr.message);
    }
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    let fromRedis = false;
    const cached = await redis.get(`sessions:user:${req.user._id}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          fromRedis = true;
          console.log(`[Redis] Serving session list from Redis for user ${req.user._id}`);
          return res.json(parsed);
        }
        // If not an array, treat as corrupted
        await redis.del(`sessions:user:${req.user._id}`);
        console.warn("[Redis] Corrupted session list cache deleted");
      } catch (e) {
        await redis.del(`sessions:user:${req.user._id}`);
        console.error("[Redis] Failed to parse session list cache, deleted:", e.message);
      }
    }
    // Fallback to MongoDB
    const sessions = await Session.find({ user: req.user._id }).sort({ updatedAt: -1 });
    try {
      await redis.set(`sessions:user:${req.user._id}`, JSON.stringify(sessions));
      console.log("[Redis] Session list cached for user", req.user._id);
    } catch (redisErr) {
      console.warn("[Redis] Failed to cache session list:", redisErr.message);
    }
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.error("Invalid session ID:", req.params.id);
      return res.status(400).json({ error: "Invalid session ID" });
    }

    let fromRedis = false;
    const cached = await redis.get(`session:${req.params.id}`);
    if (cached) {
      try {
        const session = JSON.parse(cached);
        if (session.data?.messages && session.data.messages.length > 0) {
          fromRedis = true;
          console.log(`[Redis] Serving session ${req.params.id} from Redis`);
          return res.json({ ...session, _source: "redis" });
        }
        console.log("[Redis] Cache miss or empty, falling back to MongoDB");
      } catch (e) {
        await redis.del(`session:${req.params.id}`);
        console.error("[Redis] Failed to parse cached session, deleted:", e.message);
      }
    }
    // Fallback to MongoDB
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) {
      console.error("Session not found:", req.params.id);
      return res.status(404).json({ error: "Session not found" });
    }
    try {
      await redis.set(`session:${session._id}`, JSON.stringify(session));
      console.log(`[Redis] Session ${session._id} cached`);
    } catch (redisErr) {
      console.warn("[Redis] Failed to cache session:", redisErr.message);
    }
    res.json({ ...session.toObject(), _source: "mongodb" });
  } catch (err) {
    console.error("getSessionById error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ error: "Session not found" });
    try {
      await redis.del(`session:${req.params.id}`);
      await redis.del(`sessions:user:${req.user._id}`);
      console.log(`[Redis] Deleted session and session list cache for user ${req.user._id}`);
    } catch (redisErr) {
      console.warn("[Redis] Failed to delete session/session list cache:", redisErr.message);
    }
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};