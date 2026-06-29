import React, { useState } from "react";
import "./parentWizard.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

// ✅ Temporary Inline Footer to avoid errors
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 CareNest. All rights reserved.</p>
      </div>
    </footer>
  );
};

const ParentStep2 = () => {
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    phone: "",
    email: "",
    city: "",
  });

  // ✅ Helper to merge profile data into localStorage
  function updateProfile(key, updates) {
    const existing = JSON.parse(localStorage.getItem(key)) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  }

  const handleChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!contactData.phone || !contactData.email || !contactData.city) {
      alert("Please fill in all required fields");
      return;
    }

    // STEP 2 (Contact Info)
    localStorage.setItem(
      "ParentStep2",
      JSON.stringify({
        phone: contactData.phone,
        email: contactData.email,
        city: contactData.city,
      })
    );

    updateProfile("parentProfile", {
      phone: contactData.phone,
      email: contactData.email,
      city: contactData.city,
    });

    navigate("/parent-step3"); // ✅ move to next step
  };

  return (
    <div className="parent-step-page">
      <Header />

      <div className="parent-form-container">
        <h2>Contact Information</h2>
        <p>We’ll use this to connect caretakers with you</p>

        <form className="parent-form" onSubmit={handleNext}>
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. 0301-1234567"
            value={contactData.phone}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={contactData.email}
            onChange={handleChange}
            required
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Lahore, Karachi"
            value={contactData.city}
            onChange={handleChange}
            required
          />

          <div className="wizard-buttons">
            <button type="button" onClick={() => navigate(-1)} className="back-btn">
              Back
            </button>
            <button type="submit" className="next-btn">Next</button>
          </div>
        </form>
      </div>

      {/* ✅ Wave Divider */}
      <div className="wizard-wave">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#d04d6a"
            d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,181.3C1120,181,1280,139,1360,117.3L1440,96V320H0Z"
          ></path>
        </svg>
      </div>

      <Footer />

      {/* ✅ Bottom Footer Section */}
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

export default ParentStep2;