import React, { useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import { FaDog, FaUtensils, FaBroom, FaHome } from "react-icons/fa";
import "./Caretaker.css";

const CaretakerStep2 = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]); // ARRAY

  function updateProfile(updates) {
    const existing = JSON.parse(localStorage.getItem("caretaker_profile")) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem("caretaker_profile", JSON.stringify(updated));
  }

  const handleSelect = (option) => {
    if (selectedSkills.includes(option)) {
      setSelectedSkills(selectedSkills.filter((skill) => skill !== option));
    } else {
      setSelectedSkills([...selectedSkills, option]);
    }
  };

  return (
    <div className="Caretaker-step2-container">
      <Header />

      <div className="content-wrapper">
        <div className="message-box">
          <p>What are you comfortable with?</p>
        </div>

        <div className="options">
          <div
            className={`card ${selectedSkills.includes("Pets") ? "selected" : ""}`}
            onClick={() => handleSelect("Pets")}
          >
            <FaDog size={50} />
            <p>Pets</p>
          </div>

          <div
            className={`card ${selectedSkills.includes("Cooking") ? "selected" : ""}`}
            onClick={() => handleSelect("Cooking")}
          >
            <FaUtensils size={50} />
            <p>Cooking</p>
          </div>

          <div
            className={`card ${selectedSkills.includes("Chores") ? "selected" : ""}`}
            onClick={() => handleSelect("Chores")}
          >
            <FaBroom size={50} />
            <p>Chores</p>
          </div>

          <div
            className={`card ${selectedSkills.includes("Home Assistance") ? "selected" : ""}`}
            onClick={() => handleSelect("Home Assistance")}
          >
            <FaHome size={50} />
            <p>Home Assistance</p>
          </div>
        </div>

        <div className="nav-buttons">
          <button className="back-btn" onClick={() => navigate("/Caretakerstep1")}>
            Back
          </button>
          <button
            className="next-btn"
            onClick={() => {
              updateProfile({
                skills: selectedSkills
            });
              navigate("/Caretakerstep3");
            }}
            disabled={selectedSkills.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaretakerStep2;