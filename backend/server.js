// ---------------- IMPORTS ----------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


// Route imports
import authRoutes from "./routes/auth.js";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.js";
import adminRoutes from "./routes/adminroutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import caretakerRoutes from "./routes/caretakerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from './routes/chatRoutes.js';
import connectDB from "./config/db.js";

// ---------------- CONFIG ----------------
dotenv.config();
connectDB();

const app = express();


// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- MIDDLEWARE ----------------

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Parse incoming JSON
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- ROUTES ----------------

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordRoutes);

// User role routes
app.use("/api/parents", parentRoutes);
app.use("/api/caretakers", caretakerRoutes);

// Booking system routes
app.use("/api/bookings", bookingRoutes);

// Chat routes
app.use("/api/chats", chatRoutes);

// Notification (bell icon) routes
app.use("/api/notifications", notificationRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.status(200).send("CareNest backend running");
});


// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});


