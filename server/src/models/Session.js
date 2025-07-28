import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }, // chat/code/UI state
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;