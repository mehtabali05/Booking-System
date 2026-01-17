import React, { useState } from "react";
import "./BookingModal.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const BookingModal = ({ caretakerId, onClose }) => {
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Morning");
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const submitBooking = async () => {
    if (!bookingDate) {
      alert("Please select a date");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caretakerId,
          bookingDate,
          timeSlot,
          hours,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Booking request sent");
        onClose();
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Create booking error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal-backdrop">
      <div className="booking-modal">
        <h3>Create Booking</h3>

        <label>Date</label>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />

        <label>Time Slot</label>
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
 
        <label>Hours</label>
        <input
          type="number"
          min="1"
          max="12"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <div className="actions">
          <button onClick={onClose} className="cancel">
            Cancel
          </button>
          <button onClick={submitBooking} disabled={loading}>
            {loading ? "Sending..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
