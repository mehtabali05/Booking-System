import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "./parentWizard.css";

const ParentStep5 = () => {
  const navigate = useNavigate();
  const [hourlyRate, setHourlyRate] = useState("");

  // ✅ Helper to merge profile data into localStorage
  function updateProfile(key, updates) {
    const existing = JSON.parse(localStorage.getItem(key)) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  }

  const handleNext = () => {
    if (!hourlyRate) {
      alert("Please enter an hourly rate");
      return;
    }

    // STEP 5 (Hourly Rate)
    localStorage.setItem(
      "ParentStep5",
      JSON.stringify({
        hourlyRate: hourlyRate,
      })
    );

    updateProfile("parentProfile", {
      hourlyRate: hourlyRate,
    });

    navigate("/parent-step6");
  };

  const handleBack = () => {
    navigate("/parent-step4");
  };

  return (
    <div className="parent-step-page">
      <Header />

      {/* ---- Cartoon + Bubble + Input ---- */}
      <div className="parent-step5-container">
        <div className="character-section">
          <img
            src="/images/character.png" // replace with actual image path
            alt="Character"
            className="character-img"
          />
          <div className="character-bubble">
            What hourly rate are you willing to pay?
          </div>
        </div>

        {/* ---- PKR Input Box ---- */}
        <div className="hourly-input-bar">
          <span className="currency-label">PKR</span>
          <input
            type="number"
            placeholder="Hourly rate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
          <span className="per-hour-label">/hr</span>
        </div>
      </div>

      {/* ---- Back / Next Buttons ---- */}
      <div className="step-buttons-bottom">
        <button onClick={handleBack} className="back-btn">
          Back
        </button>
        <button onClick={handleNext} className="next-btn">
          Next
        </button>
      </div>

      {/* ---- Footer (Same HTML you used before) ---- */}
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

export default ParentStep5;