// // backend/Routes/adminRoutes.js
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");

// //GET /api/admin/users?role=caretaker OR ?role=parent
// router.get("/users", async (req, res) => {
//   try {
//     const { role } = req.query;
//     const filter = {};
//     if (role) filter.role = role;
//     const users = await User.find(filter).sort({ createdAt: -1 }).select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//  //GET single user
// router.get("/user/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ message: "Not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // UPDATE user (basic)
// router.put("/user/:id", async (req, res) => {
//   try {
//     const updates = req.body; // validate in real app
//     const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE user
// router.delete("/user/:id", async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "User deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }d
// });

// module.exports = router;



// backend/routes/adminRoutes.js
import express from "express";
import User from "../models/User.js";
import authenticateUser from "../middlewares/authenticateUser.js"; // JWT auth middleware
import authorizeRole from "../middlewares/authorizeRole.js";

const router = express.Router();

// -------------------- GET ALL USERS --------------------
// GET /api/admin/users?role=parent OR ?role=caretaker
router.get(
  "/users",
  authenticateUser,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const { role } = req.query;
      const filter = {};
      if (role) filter.role = role;

      const users = await User.find(filter)
        .sort({ createdAt: -1 })
        .select("-password");

      res.status(200).json({ success: true, users });
    } catch (err) {
      console.error("Get all users error:", err.message);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
);

// -------------------- GET SINGLE USER --------------------
router.get(
  "/user/:id",
  authenticateUser,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      res.status(200).json({ success: true, user });
    } catch (err) {
      console.error("Get user error:", err.message);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
);

// -------------------- UPDATE USER --------------------
router.put(
  "/user/:id",
  authenticateUser,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const updates = req.body; // In production, validate allowed fields
      const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");

      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      res.status(200).json({ success: true, user });
    } catch (err) {
      console.error("Update user error:", err.message);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
);

// -------------------- DELETE USER --------------------
router.delete(
  "/user/:id",
  authenticateUser,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      res.status(200).json({ success: true, message: "User deleted" });
    } catch (err) {
      console.error("Delete user error:", err.message);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  }
);

export default router;
