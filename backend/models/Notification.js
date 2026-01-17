// backend/models/Notification.js
import mongoose from "mongoose";

/**
 * Notification Schema
 * --------------------
 * Stores system-generated notifications for users.
 * Used for in-app notification bell.
 */
const notificationSchema = new mongoose.Schema(
  {
    // User who receives the notification (Parent or Caretaker)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Notification message shown to user
    message: {
      type: String,
      required: true,
    },

    // Read/unread state for UI highlighting
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Optional reference to booking for navigation
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
