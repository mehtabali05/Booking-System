import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ChatScreen.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ChatScreen = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "PARENT" or "CARETAKER"

  useEffect(() => {
    fetchChat();
    // eslint-disable-next-line
  }, [chatId]);

  const fetchChat = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chats/${chatId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        setChat(data.chat);
      }
    } catch (err) {
      console.error("Failed to load chat", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch(
        `${API_URL}/api/chats/${chatId}/message`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: message }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("");
        fetchChat(); // reload chat
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading) return <p className="loading">Loading chat...</p>;
  if (!chat) return <p>Chat not found</p>;

  const bookingStatus = chat.bookingId?.status;
  const isReadOnly =
    bookingStatus === "CANCELLED" ||
    bookingStatus === "COMPLETED";

  const otherUser =
    userRole === "parent"
      ? chat.caretakerId
      : chat.parentId;

  return (
    <div className="chat-screen">
      {/* HEADER */}
      <div className="chat-header">
        <h3>{otherUser?.fullName}</h3>
        <span className={`status ${bookingStatus?.toLowerCase()}`}>
          {bookingStatus}
        </span>
      </div>

      {/* MESSAGES */}
      <div className="chat-messages">
        {chat.messages.length === 0 ? (
          <p className="empty">No messages yet</p>
        ) : (
          chat.messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                msg.sender.toLowerCase() === userRole.toLowerCase() ? "sent" : "received"
              }`}
            >
              <p>{msg.text}</p>
              <span className="time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          type="text"
          placeholder={
            isReadOnly
              ? "Chat is closed for this booking"
              : "Type your message..."
          }
          value={message}
          disabled={isReadOnly}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={isReadOnly}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
