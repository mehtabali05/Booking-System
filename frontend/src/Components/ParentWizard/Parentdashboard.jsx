import React, { useEffect, useState } from "react";
import { FiSearch, FiArrowRight, FiBell, FiLogOut } from "react-icons/fi";
import CaretakerCard from "./CaretakerCard";
import "./parentWizard.css";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../notifications/NotificationBell";
import useUnreadMessages from "../../hooks/useUnreadMessages";

const ParentDashboard = () => {
  const [caretakers, setCaretakers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); 
  const { count: unreadMessages } = useUnreadMessages();

  const goToParentStep1 = () => {
    navigate("/parent-step1");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const scrollRight = () => {
    document
      .querySelector(".caretaker-scroll")
      ?.scrollBy({ left: 300, behavior: "smooth" });
  };


useEffect(() => {
  const fetchCaretakers = async () => {
    try {
      // 1. Get the token from localStorage
      const token = localStorage.getItem("token"); 

      const response = await fetch(
        "http://localhost:5000/api/caretakers",
        { 
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            // 2. Attach the token here
            "Authorization": `Bearer ${token}` 
          }
        }
      );
      const data = await response.json();

      if (data.success) {
        setCaretakers(data.caretakers || []);
        console.log("Caretakers: ",data.caretakers);
      } else {
        setCaretakers([]);
      }
    } catch (error) {
      console.error("Error fetching caretakers:", error);
      setCaretakers([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCaretakers();
}, []);

  return (
    <div className="parent-dashboard">
      {/* ===== DASHBOARD HEADER ===== */}
      <div className="dashboard-header">
        <div className="logo">Carenest</div>

        <div className="header-links">
          <span className="active">Babysitters</span>
          <span>Babysitting jobs</span>
          <span
            className="messages-tab"
            onClick={() => navigate("/messages")}
          >
            Messages
            {unreadMessages > 0 && (
              <span className="badge">{unreadMessages}</span>
            )}
          </span>
          <span>How it works</span>
          <span>Pricing</span>
        </div>

        <div className="header-actions">
          {/* <FiBell className="icon" /> */}
          <NotificationBell />
          <FiLogOut className="icon" onClick={handleLogout} />
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="dashboard-content">
        <h2 className="welcome">Welcome back!</h2>

        <div className="tabs">
          <span className="active">Babysitters</span>
          <span>Nannies</span>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Quickly find a babysitter | City or postal code"
          />
          <button className="search-btn">
            <FiSearch />
          </button>
        </div>

        <div className="next-steps">
          <h3>Next steps</h3>

          <div className="cards">
            <div className="step-card profile" onClick={goToParentStep1}>
              <div className="step-content">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4221/4221419.png"
                  alt="profile"
                />
                <div>
                  <h4>Complete your profile</h4>
                  <p>Complete your profile to contact great babysitters.</p>
                </div>
              </div>
              <FiArrowRight className="arrow" />
            </div>

            <div className="step-card verify">
              <div className="step-content">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4221/4221446.png"
                  alt="verify"
                />
                <div>
                  <h4>Verify identity</h4>
                  <p>Verify your account for better trust & safety.</p>
                </div>
              </div>
              <FiArrowRight className="arrow" />
            </div>
          </div>
        </div>

        <div className="find-sitter">
          <h2>Find a sitter your kids will love</h2>
        </div>

        <div className="caretaker-carousel">
          <div className="caretaker-scroll">
            {loading ? (
              <p>Loading caretakers...</p>
            ) : caretakers.length === 0 ? (
              <p>No caretakers available yet.</p>
            ) : (
              caretakers.map((ct) => (
  <CaretakerCard key={ct._id} caretaker={ct} />
))
            )}
          </div>

          <div className="scroll-arrow" onClick={scrollRight}>
            →
          </div>
        </div>
      </div>

      <div className="bg-shape"></div>
    </div>
  );
};

export default ParentDashboard;
