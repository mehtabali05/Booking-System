import React, { useState } from "react";
import Header from "../Header";
import "./parentWizard.css";
import { useNavigate } from "react-router-dom";

const ParentStep6 = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");


  function updateProfile(key, updates) {
    const existing = JSON.parse(localStorage.getItem(key)) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  }

  // -----------------------------
  // NEXT BUTTON HANDLER
  // -----------------------------
  const handleNext = () => {
    if (!selectedOption) {
      alert("Please select an option");
      return;
    }

    // STEP 6 (Babysitting Location)
    localStorage.setItem(
      "parentStep6",
      JSON.stringify({ babysittingLocation: selectedOption })
    );

    updateProfile("parentProfile", {
      babysittingLocation: selectedOption,
    });

    navigate("/parent-step7");
  };

  return (
    <div className="parent-step-container">
      <Header />

      <div className="step-content">
        <div className="image-message-container">
          <div className="step-image"></div>

          <div className="step-message">
            Where do you prefer the babysitting to take place?
          </div>
        </div>

        <div className="home-options-container">
          <div
            className={`home-option-box ${
              selectedOption === "ourHome" ? "selected" : ""
            }`}
            onClick={() => setSelectedOption("ourHome")}
          >
            At our home
          </div>

          <div
            className={`home-option-box ${
              selectedOption === "babysitterHome" ? "selected" : ""
            }`}
            onClick={() => setSelectedOption("babysitterHome")}
          >
            At the babysitter's
          </div>
        </div>

        <div className="buttons-container">
          <div className="step-buttons">
            <button className="back-btn" onClick={() => navigate("/parent-step5")}>
              Back
            </button>

            <button
              className="next-btn"
              onClick={handleNext}
              disabled={!selectedOption}
            >
              Next
            </button>
          </div>
        </div>
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

export default ParentStep6;