import { useEffect, useState, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const useUnreadMessages = () => {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/chats/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Hook fetch error", err);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    // Optional: set an interval to check every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  return { count, refresh: fetchCount };
};

export default useUnreadMessages;