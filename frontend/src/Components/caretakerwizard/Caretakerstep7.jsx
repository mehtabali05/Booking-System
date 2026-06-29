import React, { useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import "./Caretaker.css";

const CaretakerStep7 = () => {
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
    <div className="caretaker-step7-container">
      <Header />

      <div className="content-wrapper">
        <div className="message-box">
          <p>Who may view your profile?</p>
        </div>

        <div className="options">
          <div
            className={`card ${selected === "Everyone" ? "selected" : ""}`}
            onClick={() => handleSelect("Everyone")}
          >
            <h3>Everyone</h3>
            <p>
              Babysits members, public search engines, and job boards can view
              your profile.
            </p>
          </div>

          <div
            className={`card ${selected === "Only Babysits members" ? "selected" : ""}`}
            onClick={() => handleSelect("Only Babysits members")}
          >
            <h3>Only Babysits members</h3>
            <p>
              Only Babysits members can view your profile. This may reduce the
              messages you get.
            </p>
          </div>
        </div>

        <div className="nav-buttons">
          <button className="back-btn" onClick={() => navigate("/caretakerstep6")}>
            Back
          </button>
          <button
            className="next-btn"
            onClick={() => {
              updateProfile({
                getJobNotifications: null, // already set in Step6
                visibility: selected === "Everyone" ? "public" : "membersOnly"
              });
              navigate("/Caretakerstep8");
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

export default CaretakerStep7;