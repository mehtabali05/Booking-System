// backend/models/Booking.js
import mongoose from "mongoose";

/**
 * Booking Schema
 * ---------------
 * Represents a single booking request sent by a Parent
 * to a specific Caretaker.
 */
const bookingSchema = new mongoose.Schema(
  {
    // Parent who created the booking request
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,
      index: true,
    },
 
    // Caretaker who receives the booking request
    caretakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caretaker",
      required: true,
      index: true,
    },

    // Date of service (e.g., 2025-12-20)
    bookingDate: {
      type: Date, 
      required: true,
    },

    // Time slot (Morning / Afternoon / Evening / Night)
    timeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening", "Night"],
      required: true,
    },

    // Number of hours requested
    hours: {
      type: Number,
      required: true,
      min: 1,
    },

    // Optional message from parent
    message: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // Booking status lifecycle
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
      index: true,
    },
    totalAmount: { // Added totalAmount
      type: Number,
      default: 0
    },

    // Timestamp when caretaker responds
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("Booking", bookingSchema);
