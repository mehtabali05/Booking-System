import React, { useEffect, useState } from "react";
import "./ParentBookings.css";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ParentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/parent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
    } catch (err) {
      console.error("Fetch parent bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking request?")) return;

    try {
      await fetch(`${API_URL}/api/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="parent-bookings">
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="booking-card">
            <h4>{b.caretakerId.fullName}</h4>
            <p>{new Date(b.bookingDate).toDateString()}</p>
            <p>{b.timeSlot} • {b.hours} hrs</p>
            <p>Status: <strong>{b.status}</strong></p>

            {b.status === "PENDING" && (
              <button onClick={() => cancelBooking(b._id)}>
                Cancel
              </button>
            )}

              {b.status === "ACCEPTED" && b.chatId && (
                <button onClick={() => navigate(`/messages/${b.chatId}`)}>
                  Message Caretaker
                </button>
              )}

              {/* Optional: Show a message if chat isn't ready yet */}
              {b.status === "ACCEPTED" && !b.chatId && (
                <p><small>Initializing chat...</small></p>
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default ParentBookings;
