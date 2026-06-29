import React, { useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import "./Caretaker.css";

const CaretakerStep6 = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  function updateProfile(updates) {
    const existing = JSON.parse(localStorage.getItem("caretaker_profile")) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem("caretaker_profile", JSON.stringify(updated));
  }

  const handleSelect = (option) => {
    setSelected(option);
  };

  return (
    <div className="caretaker-step5-container">
      <Header />

      <div className="content-wrapper">
        <div className="message-box">
          <p>Some last questions!</p>
        </div>

        <div className="question-text">
          <p>Do you want to get notifications from new babysitting jobs in your area?</p>
        </div>

        <div className="options">
          <div
            className={`card ${selected === "Yes" ? "selected" : ""}`}
            onClick={() => handleSelect("Yes")}
          >
            <p>Yes</p>
          </div>

          <div
            className={`card ${selected === "No" ? "selected" : ""}`}
            onClick={() => handleSelect("No")}
          >
            <p>No</p>
          </div>
        </div>

        <div className="nav-buttons">
          <button className="back-btn" onClick={() => navigate("/caretakerstep5")}>
            Back
          </button>
          <button
            className="next-btn"
            onClick={() => {
              // ✅ Save notifications field correctly
              updateProfile({
                notificationsEnabled: selected === "Yes"
              });
              navigate("/Caretakerstep7");
            }}
            disabled={!selected}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaretakerStep6;