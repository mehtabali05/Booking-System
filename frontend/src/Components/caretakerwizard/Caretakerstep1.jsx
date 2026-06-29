import React, { useState } from "react";
import Header from "../Header";
import { FiUser, FiMapPin, FiCalendar, FiGlobe, FiBook } from "react-icons/fi";
import "./Caretaker.css";
import { useNavigate } from "react-router-dom";

const CaretakerStep1 = () => {
  const navigate = useNavigate();

   
  function updateProfile(updates) {
    const existing = JSON.parse(localStorage.getItem("caretaker_profile")) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem("caretaker_profile", JSON.stringify(updated));
  }

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [language, setLanguage] = useState("");
  const [education, setEducation] = useState("");

  
  const handleNext = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  updateProfile({
    userId: user?._id,
    fullName,
    dateOfBirth: birthdate,
    gender: "Not Provided",
    city: address,
    languages: [language],
    education,
  });

  navigate("/caretakerstep2");
};



  return (
    <div className="caretaker-step-container">
      <Header />

      <div className="step-body">
        <h2 className="step-title">Tell us about yourself</h2>

        <div className="input-group">
          <FiUser className="input-icon" />
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiMapPin className="input-icon" />
          <input
            type="text"
            placeholder="Full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiCalendar className="input-icon" />
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiGlobe className="input-icon" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select language</option>
            <option>English</option>
            <option>Urdu</option>
            <option>Hindi</option>
            <option>French</option>
          </select>
        </div>

        <div className="input-group">
          <FiBook className="input-icon" />
          <textarea
            rows="3"
            placeholder="Describe your education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          ></textarea>
        </div>

        <div className="step-buttons">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>

          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      {/* Footer stays EXACTLY same */}
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

export default CaretakerStep1;
