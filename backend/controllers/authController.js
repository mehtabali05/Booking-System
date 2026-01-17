// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import transport from "../nodemailer/config.js"; // nodemailer ES6

// -------------------- SIGNUP --------------------
export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "parent",
      otp,
      otpExpireTime: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      isVerified: false
    });

    await user.save();

    // Send OTP email
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email, 
      subject: "NestCare Email Verification",
      text: `Your OTP code is: ${otp}`,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- VERIFY OTP --------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpExpireTime || user.otpExpireTime < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpireTime = undefined;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully!",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified }
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isVerified === "pending") return res.status(400).json({ message: "User not verified" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- RESEND OTP --------------------
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid user email" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    user.otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "NestCare OTP Verification",
      text: `Your OTP code is: ${otp}`
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





  