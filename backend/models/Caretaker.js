import mongoose from "mongoose";
import { availabilitySchema } from "./subSchemas/availabilitySchema.js";

/**
 * Caretaker Profile
 * ------------------
 * Stores caretaker-specific professional data.
 */
const caretakerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    dateOfBirth: String,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Not Provided"],
      default: "Not Provided",
    },

    city: {
      type: String,
      required: true,
    },

    languages: {
      type: [String],
      default: [],
    },

    education: String,

    skills: {
      type: [String],
      default: [],
    },

    preference: {
      type: String,
      enum: ["familyHome", "myHome"],
    },

    description: {
      type: String,
      minlength: 50, 
    },

    photo: String,

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    visibility: {
      type: String,
      enum: ["public", "membersOnly"],
      default: "public",
    },

    availability: availabilitySchema,

    hourlyRate: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Caretaker", caretakerSchema);
