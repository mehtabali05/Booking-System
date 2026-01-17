import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // password not returned by default
    },

    role: {
      type: String,
      enum: ["parent", "caretaker", "admin"],
      default: "parent",
    },

    // OTP should be string to preserve leading zeros
    otp: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otpExpireTime: {
      type: Date,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
