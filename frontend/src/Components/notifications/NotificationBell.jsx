import React, { useEffect, useState, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./notifications.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 1️⃣ Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Unread count error:", err);
    }
  };

  // 2️⃣ Fetch notifications (latest 20)
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

  // 3️⃣ Mark notification as read and navigate
  const handleNotificationClick = async (notification) => {
    try {
      await fetch(
        `${API_URL}/api/notifications/${notification._id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchUnreadCount();

      if (notification.bookingId) {
        // navigate(`/bookings/${notification.bookingId}`);
        const role = localStorage.getItem("role");

        if (role === "parent") {
        navigate("/parent/bookings");
        } else {
        navigate("/caretaker/bookings");
        }
      }

      setOpen(false);
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // 4️⃣ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  return (
    <div className="notification-bell" ref={bellRef}>
      <FiBell className="icon" onClick={() => setOpen(!open)} />

      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount}</span>
      )}

      {open && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>

          {notifications.length === 0 ? (
            <p className="empty">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${!n.isRead ? "unread" : ""}`}
                onClick={() => handleNotificationClick(n)}
              >
                <p>{n.message}</p>
                <span>
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
