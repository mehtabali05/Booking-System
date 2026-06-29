// backend/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not set. Skipping MongoDB connection. Add it to backend/.env when ready.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB connection error:", err.message);
  }
};

export default connectDB;
