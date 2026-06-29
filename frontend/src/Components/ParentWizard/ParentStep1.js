import React, { useState } from "react";
import "./parentWizard.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header"; 

// ✅ Footer component directly inside this file
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 CareNest. All rights reserved.</p>
      </div>
    </footer>
  );
};

const ParentStep1 = () => {
  const navigate = useNavigate();

  const [parentData, setParentData] = useState({
    fullName: "",
    address: "",
  });

  // ✅ Helper to merge profile data into localStorage
  function updateProfile(key, updates) {
    const existing = JSON.parse(localStorage.getItem(key)) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  }

  const handleChange = (e) => {
    setParentData({
      ...parentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!parentData.fullName || !parentData.address) {
      alert("Please fill in all fields");
      return;
    }

    // STEP 1 (Personal Info)
    localStorage.setItem("ParentStep1", JSON.stringify(parentData));

    updateProfile("parentProfile", parentData);

    navigate("/parent-step2");
  };

  return (
    <div className="parent-step-page">
      <Header />

      <div className="parent-form-container">
        <h2>Tell us about yourself</h2>
        <p>We’ll use this information to personalize your experience</p>

        <form className="parent-form" onSubmit={handleNext}>
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={parentData.fullName}
            onChange={handleChange}
            required
          />

          <label>Full Address</label>
          <input
            type="text"
            name="address"
            placeholder="House No, Street, City"
            value={parentData.address}
            onChange={handleChange}
            required
          />

          <button type="submit" className="next-btn">
            Next
          </button>
        </form>
      </div>

      {/* Pink Wave Divider */}
      <div className="wizard-wave">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#d04d6a"
            d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,181.3C1120,181,1280,139,1360,117.3L1440,96V320H0Z"
          ></path>
        </svg>
      </div>

      {/* Footer */}
      <Footer />

      {/* Bottom Footer Section */}
      <section className="bottom-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Babysits</h4>
            <button type="button" className="footer-link">
              How it works
            </button>
            <button type="button" className="footer-link">
              Help
            </button>
            <button type="button" className="footer-link">
              Terms & Privacy
            </button>
            <button type="button" className="footer-link">
              Pricing
            </button>
          </div>

          <div className="footer-col">
            <h4>Discover</h4>
            <button type="button" className="footer-link">
              About us
            </button>
            <button type="button" className="footer-link">
              Tips & Articles
            </button>
            <button type="button" className="footer-link">
              Trust & Safety
            </button>
          </div>

          <div className="footer-col">
            <h4>Popular</h4>
            <button type="button" className="footer-link">
              Babysitter Karachi
            </button>
            <button type="button" className="footer-link">
              Babysitter Lahore
            </button>
            <button type="button" className="footer-link">
              Babysitting jobs
            </button>
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

export default ParentStep1;
