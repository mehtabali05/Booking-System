// const express = require("express");
// const { body } = require("express-validator");
// const router = express.Router();

// const {
//   signup,
//   login,
//   verifyOtp,
//   resendOtp
// } = require("../controllers/authController");

// // -------------------- SIGNUP --------------------
// router.post(
//   "/signup",
//   [
//     body("name")
//       .notEmpty().withMessage("Name is required")
//       .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

//     body("email")
//       .isEmail().withMessage("Invalid email address"),

//     body("password")
//       .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

//     body("role")
//       .notEmpty().withMessage("Role is required")
//       .isIn(["parent", "caretaker"]).withMessage("Invalid role selected")
//   ],
//   signup
// );

// // -------------------- LOGIN --------------------
// router.post(
//   "/login",
//   [
//     body("email")
//       .isEmail().withMessage("Invalid email format"),

//     body("password")
//       .notEmpty().withMessage("Password is required")
//   ],
//   login
// ); 


// router.post("/verify-otp", verifyOtp);
// router.post("/resend/:email", resendOtp);

// module.exports = router;


// backend/routes/auth.js
import express from "express";
import { body } from "express-validator";
import { signup, login, verifyOtp, resendOtp } from "../controllers/authController.js";

  const router = express.Router();

  // -------------------- SIGNUP --------------------
  router.post(
    "/signup",
    [
      body("name").notEmpty().withMessage("Name is required").isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
      body("email").isEmail().withMessage("Invalid email address"),
      body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
      body("role").notEmpty().withMessage("Role is required").isIn(["parent", "caretaker"]).withMessage("Invalid role selected")
    ],
    signup
  );

// -------------------- LOGIN --------------------
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  login
);

// -------------------- OTP --------------------
router.post("/verify-otp", verifyOtp);
router.post("/resend/:email", resendOtp);

export default router;
