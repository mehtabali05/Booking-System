import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { FaHome, FaUsers } from "react-icons/fa";
import "./Caretaker.css";

const CaretakerStep3 = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  function updateProfile(updates) {
    const existing = JSON.parse(localStorage.getItem("caretaker_profile")) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem("caretaker_profile", JSON.stringify(updated));
  }

  const handleSelect = (option) => {
    setSelected(option);
  };

  return (
    <div className="caretaker-step3">
      <Header />
      <div className="step3-container">
        <h2 className="question">Where do you prefer the babysitting to take place?</h2>

        <div className="options">
          <div
            className={`card ${selected === "At the family" ? "selected" : ""}`}
            onClick={() => handleSelect("At the family")}
          >
            <FaUsers size={50} />
            <p>At the family</p>
          </div>

          <div
            className={`card ${selected === "At my home" ? "selected" : ""}`}
            onClick={() => handleSelect("At my home")}
          >
            <FaHome size={50} />
            <p>At my home</p>
          </div>
        </div>

        <div className="navigation">
          <button className="back" onClick={() => navigate("/caretakerstep2")}>
            Back
          </button>
          <button
            className="next"
            onClick={() => {
              updateProfile({
                preference: selected === "At the family" ? "familyHome" : "myHome",
                preferredLocation: selected,
              });
              navigate("/caretakerstep4");
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

export default CaretakerStep3;