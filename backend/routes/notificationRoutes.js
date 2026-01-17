import express from "express";
import authenticate from "../middlewares/authenticateUser.js";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * =====================================
 * NOTIFICATION ROUTES (Bell Icon)
 * =====================================
 * All routes are protected.
 * Any logged-in user can access their notifications.
 */

// Get all notifications for logged-in user
router.get(
  "/",
  authenticate,
  getMyNotifications
);

// Get all notifications for logged-in user
router.get(
  "/unread",
  authenticate,
  getUnreadCount
);
 
// Mark a single notification as read
router.patch(
  "/:id/read",
  authenticate,
  markNotificationAsRead
);

// Mark all notifications as read
router.patch( 
  "/read-all",
  authenticate,
  markAllNotificationsAsRead
);

export default router;
