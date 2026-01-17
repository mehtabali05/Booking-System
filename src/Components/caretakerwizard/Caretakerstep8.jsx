import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "./Caretaker.css";

const CaretakerStep8 = () => {
  const navigate = useNavigate();

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const times = ["Morning", "Afternoon", "Evening", "Night"];

  const [availability, setAvailability] = useState(
    times.reduce((acc, time) => {
      acc[time] = days.reduce((obj, day) => {
        obj[day] = false;
        return obj;
      }, {});
      return acc;
    }, {})
  );

  const [message, setMessage] = useState(""); // ✅ Success/Error message

  const handleCheckboxChange = (time, day) => {
    setAvailability({
      ...availability,
      [time]: {
        ...availability[time],
        [day]: !availability[time][day],
      },
    });
  };



const handleSubmit = async () => {
  const storedProfile = JSON.parse(localStorage.getItem("caretaker_profile"));

  if (!storedProfile) {
    setMessage("Profile data missing. Please restart setup.");
    return;
  }

  const hasAvailability = Object.values(availability).some(time =>
    Object.values(time).some(Boolean)
  );

  if (!hasAvailability) {
    setMessage("Please select at least one available time slot.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("Authentication error. Please log in again.");
    return;
  }

  const forbidden = ["hourlyRate", "price", "childAge", "jobTitle", "budgetPerHour"];
  forbidden.forEach(f => delete storedProfile[f]);

  const payload = {
    ...storedProfile,
    availability,
  };

  try {
    const res = await fetch("http://localhost:5000/api/caretakers/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.removeItem("caretaker_profile");
      localStorage.removeItem("caretaker_step8");

      localStorage.setItem("LATEST_CARETAKER_ID", data.caretaker._id);

      setMessage("Profile successfully created! Redirecting...");
      setTimeout(() => navigate("/caretakerdashboard"), 2000);
    } else {
      setMessage(data.message || "Failed to save profile.");
    }
  } catch (error) {
    console.error("Submit error:", error);
    setMessage("Server error. Please try again.");
  }
};


return (
    <div className="availability-page">
      <Header />

      <div className="availability-container">
        <h2>When do you need a babysitter?</h2>

        <div className="availability-table">
          <div className="table-header">
            <div className="time-cell"></div>
            {days.map((day) => (
              <div key={day} className="day-cell">{day}</div>
            ))}
          </div>

          {times.map((time) => (
            <div key={time} className="table-row">
              <div className="time-cell">{time}</div>
              {days.map((day) => (
                <div key={day} className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={availability[time][day]}
                    onChange={() => handleCheckboxChange(time, day)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button className="back-btn" onClick={() => navigate("/Caretakerstep7")}>
            Back
          </button>
          <button className="next-btn" onClick={handleSubmit}>
            Next
          </button>
        </div>

        {/* ✅ Show success/error messages */}
        {message && <p className="message">{message}</p>}
      </div>

      <section className="bottom-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Babysits</h4>
            <a href="#">How it works</a>
            <a href="#">Help</a>
            <a href="#">Terms & Privacy</a>
            <a href="#">Pricing</a>
          </div>
          <div className="footer-col">
            <h4>Discover</h4>
            <a href="#">About us</a>
            <a href="#">Tips & Articles</a>
            <a href="#">Trust & Safety</a>
          </div>
          <div className="footer-col">
            <h4>Popular</h4>
            <a href="#">Babysitter Karachi</a>
            <a href="#">Babysitter Lahore</a>
            <a href="#">Babysitting jobs</a>
          </div>
        </div>

        <hr />

        <div className="social-section">
          <h4>Follow us on</h4>
          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-linkedin"></i>
          </div>
          <p>© CareNest 2025</p>
        </div>
      </section>
    </div>
  );
};

export default CaretakerStep8;
