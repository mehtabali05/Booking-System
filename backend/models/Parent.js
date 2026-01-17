import mongoose from "mongoose";

/**
 * Parent Profile
 * ----------------
 * Stores parent-specific profile data only.
 * Authentication data lives in User model.
 */
const parentSchema = new mongoose.Schema(
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
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    numberOfChildren: {
      type: Number,
      default: 0,
    },

    kidsAges: {
      type: [Number],
      default: [],
    },

    babysittingLocation: {
      type: String,
      enum: ["ourHome", "babysitterHome"],
      default: "ourHome",
    },

    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Parent", parentSchema);

