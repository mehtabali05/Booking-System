import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHeart, FiCheckCircle, FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import "./Caretakerprofile.css";
import NotificationBell from "../notifications/NotificationBell";
import BookingModal from "../bookings/BookingModal";

const API_URL = "http://localhost:5000";

const CaretakerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caretaker, setCaretaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token"); // ✅ GET TOKEN

    // --- CHANGE 1: Corrected the endpoint URL to /profile/${id} ---
    fetch(`${API_URL}/api/caretakers/profile/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✅ CHANGE 2: Added Auth Header
      }
    }) 
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCaretaker(data.caretaker);
        } else {
          console.error("Fetch failed:", data.message);
        }
      })
      .catch((err) => console.error("Error fetching caretaker profile:", err))
      .finally(() => setLoading(false)); // ✅ Stop loading regardless of result
  }, [id]);

  if(loading) return <div className="loading-container"><p>Loading profile...</p></div>;

  if (!caretaker) return <div className="loading-container"><p>Caretaker not found.</p></div>;

  const imageUrl = caretaker.photo
    ? `${API_URL}${caretaker.photo}`
    : "https://via.placeholder.com/160";

  // Calculate age from dateOfBirth
  const age = caretaker.dateOfBirth
    ? Math.floor((Date.now() - new Date(caretaker.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : caretaker.age || "Not provided";

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
    localStorage.clear();
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="profile-page-wrapper">
      {/* --- NEW HEADER SECTION --- */}
      <nav className="main-navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">👤</span>
            <span className="logo-text">Caretaker</span>
          </div>

          <div className="nav-search-bar">
            <input type="text" placeholder="Start your search" />
            <button className="search-btn">
              <FiSearch />
            </button>
          </div>

          <div className="nav-actions">
            <div className="nav-icon-wrapper">
              <NotificationBell />
              {/* <FiBell className="nav-icon" /> */}
              <span className="notification-dot"></span>
            </div>
            <div className="nav-icon-wrapper" onClick={handleLogout} title="Logout">
              <FiLogOut className="nav-icon logout-icon" />
            </div>
          </div>
        </div>
      </nav>

      {/* --- YOUR ORIGINAL PROFILE CONTENT --- */}
      <div className="profile-container">
        <div className="profile-hero">
          <div className="hero-content">
            <div className="avatar-wrapper">
              <img src={imageUrl} alt={caretaker.fullName} className="main-avatar" />
            </div>
            <div className="hero-details">
              <h1>
                {caretaker.fullName} <FiCheckCircle className="verified-icon" />
                <span className="badge-new">New</span>
              </h1>
              <p className="hero-subtext">Nanny in {caretaker.city}</p>
              <div className="hero-stats">
                <span>Age {age}</span>
                <span>Distance ~{caretaker.distance || "Not provided"} km</span>
                <span>Hourly rate PKR {caretaker.hourlyRate || "Not provided"}/hr</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-main-grid">
          <div className="profile-left">
            <div className="activity-status">
              <span>⚡ Last activity: {caretaker.lastActive || "Recently"}</span>
            </div>

            <div className="bio-section">
              <p>{caretaker.description || "No bio provided"}</p>
            </div>

            <div className="characteristics">
              <h4>Characteristics</h4>
              <div className="tag-group">
                {caretaker.skills?.map((skill, i) => (
                  <span key={i} className="trait-tag">{skill}</span>
                ))}
              </div>
            </div>

            <hr className="divider" />

            <div className="experience-details">
               <div className="info-row">
                  <span className="info-icon">💼</span>
                  <div>
                    <strong>Experience</strong>
                    <p>{caretaker.experienceYears || "Not provided"}</p>
                  </div>
               </div>
               <div className="info-row">
                  <span className="info-icon">🎂</span>
                  <div>
                    <strong>Experience with age(s)</strong>
                    <p>{caretaker.ageGroups?.join(" • ") || "Not provided"}</p>
                  </div>
               </div>
            </div>

            {caretaker.verified && (
              <div className="verification-box">
                <FiCheckCircle className="check-success" />
                <div>
                  <strong>Government ID</strong>
                  <p>{caretaker.fullName} successfully provided a government ID and passed photo verification checks.</p>
                </div>
              </div>
            )}
          </div>

          <div className="profile-right">
            <div className="action-buttons">
              <button className="btn-contact">Contact {caretaker.fullName.split(' ')[0]}</button>
              <button className="btn-favorite"><FiHeart /></button>
            </div>

            <div className="about-me-card">
              <h3>About me</h3>
              <ul className="about-list">
                <li><span>🪪 Driver's license</span> <strong>{caretaker.driversLicense || "Not provided"}</strong></li>
                <li><span>🚗 Car</span> <strong>{caretaker.hasCar || "Not provided"}</strong></li>
                <li><span>👨‍👩‍👧 Has children</span> <strong>{caretaker.hasChildren || "Not provided"}</strong></li>
                <li><span>🚬 Smoker</span> <strong>{caretaker.smoker || "Not provided"}</strong></li>
                <li><span>🏠 Preferred location</span> <strong>{caretaker.preference || "Not provided"}</strong></li>
                <li><span>🌐 Languages</span> <strong>{caretaker.language || "Not provided"}</strong></li>
              </ul>
            </div>
            <button onClick={() => setShowBookingModal(true)}>
              Book Now
      `     </button>
          </div>
        </div>
      </div>
      {showBookingModal && (
        <BookingModal
          caretakerId={caretaker._id}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default CaretakerProfile;