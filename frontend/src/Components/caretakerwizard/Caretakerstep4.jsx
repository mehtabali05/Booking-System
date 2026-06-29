import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import "./Caretaker.css";

const CaretakerStep4 = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function updateProfile(updates) {
    const existing = JSON.parse(localStorage.getItem("caretaker_profile")) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem("caretaker_profile", JSON.stringify(updated));
  }

  const handleNext = () => {
    if (description.trim().length < 200) {
      setError("Please write at least 200 characters about yourself.");
      return;
    }
    setError("");

    updateProfile({
      description,
    });

    navigate("/CaretakerStep5");
  };

  return (
    <div className="step4-container">
      <Header />

      {/* content-wrapper keeps the box centered independent of the header */}
      <div className="content-wrapper">
        <div className="step4-box">
          <h2 className="step4-title">Tell a little about yourself</h2>

          <textarea
            className="step4-textarea"
            placeholder="Write your description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {error && <p className="step4-error">{error}</p>}

          <div className="step4-buttons">
            <button
              className="step4-back"
              onClick={() => navigate("/CaretakerStep3")}
            >
              Back
            </button>

            <button className="step4-next" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaretakerStep4;