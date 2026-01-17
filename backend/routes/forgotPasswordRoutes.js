// const express = require("express");
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// const router = express.Router();


// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenExpire = Date.now() + 10 * 60 * 1000; 

//     // Save to user
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpire = resetTokenExpire;
//     await user.save();

//     // Print reset link in terminal
//     const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
//     console.log("🔗 Password Reset Link:", resetURL);

//     res.json({
//       message:
//         "Reset link generated. Check your terminal for the link (dev mode).",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Reset password (step 2)
// router.post("/reset-password/:token", async (req, res) => {
//   try {
//     const { password } = req.body;
//     const { token } = req.params;

//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user)
//       return res.status(400).json({ message: "Invalid or expired token" });

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;

//     // Clear reset token fields
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save();

//     res.json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;




// backend/routes/forgotPasswordRoutes.js
import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import transport from "../nodemailer/config.js";

const router = express.Router();

// -------------------- FORGOT PASSWORD --------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 min

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "NestCare Password Reset",
      text: `Click here to reset your password: ${resetURL} (valid 10 min)`
    });

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -------------------- RESET PASSWORD --------------------
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
