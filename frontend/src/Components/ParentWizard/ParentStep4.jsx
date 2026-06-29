import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "./parentWizard.css";

const ParentStep4 = () => {
  const navigate = useNavigate();
  const [childrenCount, setChildrenCount] = useState(0);

  // ✅ Helper to merge profile data into localStorage
  function updateProfile(key, updates) {
    const existing = JSON.parse(localStorage.getItem(key)) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  }

  const handleNext = () => {
    if (!childrenCount) {
      alert("Please select the number of children");
      return;
    }

    const numericCount = parseInt(childrenCount); // This turns "4+" into 4
    // STEP 4 (Children Count)
    localStorage.setItem(
      "ParentStep4",
      JSON.stringify({
        numberOfChildren: numericCount,
      })
    );

    updateProfile("parentProfile", {
      numberOfChildren: childrenCount,
    });

    navigate("/parent-step5");
  };

  return (
    <div className="parent-step-page">
      <Header />

      <div className="parent-step4-container">
        <h2 className="step-title">How many children do you have?</h2>
        <p className="step-subtitle">Select one option below</p>

        {/* ✅ Number Selection Boxes */}
        <div className="children-options">
          {["1", "2", "3", "4+"].map((num) => (
            <div
              key={num}
              className={`child-box ${childrenCount === num ? "selected" : ""}`}
              onClick={() => setChildrenCount(num)}
            >
              {num}
            </div>
          ))}
        </div>

        {/* ✅ Navigation Buttons */}
        <div className="step-buttons">
          <button onClick={() => navigate("/parent-step3")} className="back-btn">
            Back
          </button>
          <button onClick={handleNext} className="next-btn">
            Next
          </button>
        </div>
      </div>

      {/* ✅ Pink SVG Wave Divider */}
      <div className="wizard-wave">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#d04d6a"
            d="M0,160L80,149.3C160,139,320,117,480,128C640,139,800,181,960,181.3C1120,181,1280,139,1360,117.3L1440,96V320H0Z"
          ></path>
        </svg>
      </div>

      {/* ✅ Footer Section Included */}
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

export default ParentStep4;