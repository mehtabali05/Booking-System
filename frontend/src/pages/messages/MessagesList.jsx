import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Messages.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const MessagesList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/chats`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.success) {
          setChats(data.chats);
        } 
      } catch (err) {
        console.error("Failed to load chats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const openChat = (chatId) => {
    navigate(`/messages/${chatId}`);
  };

  if (loading) return <p className="loading">Loading messages...</p>;

  return (
    <div className="messages-page">
      <h2 className="messages-title">Messages</h2>

      {chats.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="chat-list">
          {chats.map((chat) => {
            const isParent =
              chat.parentId?._id === chat.currentProfileId;

            const otherUser = isParent
              ? chat.caretakerId
              : chat.parentId;

            return (
              <div
                key={chat._id}
                className="chat-item"
                onClick={() => openChat(chat._id)}
              >
                <div className="chat-avatar">
                  {otherUser?.fullName?.charAt(0)}
                </div>

                <div className="chat-info">
                  <h4>{otherUser?.fullName}</h4>
                  <p className="chat-sub">
                    Booking • {chat.bookingId?.status}
                  </p>
                </div>

                <div className="chat-meta">
                  <span className="chat-time">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="chat-badge">{chat.unreadCount}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesList;
