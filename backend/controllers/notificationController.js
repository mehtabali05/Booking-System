import Notification from "../models/Notification.js";

export const getUnreadCount = async (req, res) => {
    try {
      const userId = req.user.id; // comes from auth middleware
  
      const count = await Notification.countDocuments({
        userId,
        isRead: false,
      });
  
      return res.status(200).json({
        success: true,
        unreadCount: count,
      });
    } catch (error) {
      console.error("getUnreadCount error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error fetching unread notifications",
      });
    }
};

/**
 * =====================================
 * GET ALL NOTIFICATIONS (Bell Icon)
 * =====================================
 * - Returns notifications for logged-in user
 * - Unread notifications should be highlighted in UI
 */
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Notification userId",userId)
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20); // limit for performance

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("getMyNotifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching notifications",
    });
  }
};

/**
 * =====================================
 * MARK SINGLE NOTIFICATION AS READ
 * =====================================
 * - Triggered when user clicks a notification
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId }, // user safety check
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("markNotificationAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating notification",
    });
  }
};

/**
 * =====================================
 * MARK ALL NOTIFICATIONS AS READ
 * =====================================
 * - Optional but recommended UX feature
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating notifications",
    });
  }
};
