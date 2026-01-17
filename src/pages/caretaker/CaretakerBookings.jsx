import React, { useEffect, useState } from "react";
import "./CaretakerBookings.css";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CaretakerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/caretaker`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
    } catch (err) {
      console.error("Fetch caretaker bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  const respond = async (id, action) => {
    try {
      await fetch(`${API_URL}/api/bookings/${id}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBookings();
    } catch (err) {
      console.error("Booking response error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading booking requests...</p>;

  return (
    <div className="caretaker-bookings">
      <h2>Booking Requests</h2>

      {bookings.length === 0 ? (
        <p>No requests.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="booking-card">
            <h4>{b.parentId.fullName}</h4>
            <p>{new Date(b.bookingDate).toDateString()}</p>
            <p>{b.timeSlot} • {b.hours} hrs</p>
            <p>Status: <strong>{b.status}</strong></p>

            {b.status === "PENDING" && (
              <div className="actions">
                <button onClick={() => respond(b._id, "accept")}>Accept</button>
                <button onClick={() => respond(b._id, "reject")}>Reject</button>
              </div>
            )}
            
            {b.status === "ACCEPTED" && b.chatId && (
              <button 
                className="msg-btn" 
                onClick={() => navigate(`/messages/${b.chatId}`)}
              >
                Message Parent
              </button>
            )}

            {/* Fallback if booking is accepted but chat document isn't created yet */}
            {b.status === "ACCEPTED" && !b.chatId && (
              <span className="info-text">Chat initializing...</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CaretakerBookings;
