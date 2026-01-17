import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import "./Caretaker.css";
import useUnreadMessages from "../../hooks/useUnreadMessages";
import NotificationBell from "../notifications/NotificationBell";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CaretakerDashboard = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caretakerName, setCaretakerName] = useState("");
  const [bookingCount, setBookingCount] = useState(0);
  const { count: unreadMessages } = useUnreadMessages();

  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const gotoCaretakerstep1 = () => {
    navigate("/Caretakerstep1");
  };

  useEffect(() => {
    const fetchParents = async () => { 
      try {
        const token = localStorage.getItem("token"); // Get token from storage
    
        const res = await fetch(`${API_URL}/api/caretakers/parents`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // ADD THIS LINE
          }
        });
        
        const data = await res.json();
        if (data.success && Array.isArray(data.parents)) {
          setParents(data.parents);
        } else {
          setParents([]);
        }
      } catch (err) {
        console.log("Error fetching parents:", err);
        setParents([]);
      } finally {
        setLoading(false);
      }
    };

    
    const fetchCaretakerName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Use a clean 'me' endpoint instead of trying to guess an ID
        const res = await fetch(`${API_URL}/api/caretakers/me`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }, 
        });

        const data = await res.json();
        if (data.success && data.caretaker) {
          setCaretakerName(data.caretaker.fullName);
        }
      } catch (err) {
        console.log("Error fetching caretaker profile:", err);
      }
    };

    const fetchBookingCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
    
        const res = await fetch(`${API_URL}/api/bookings/caretaker`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        const data = await res.json();
    
        if (data.success && Array.isArray(data.bookings)) {
          // Only count PENDING bookings
          const pending = data.bookings.filter(
            (b) => b.status === "PENDING"
          );
          setBookingCount(pending.length);
        }
      } catch (err) {
        console.log("Error fetching booking count:", err);
      }
    };
    

    fetchParents();
    fetchCaretakerName();
    fetchBookingCount();
  }, []);

  const openParentProfile = (id) => {
    navigate(`/parent-profile/${id}`);
  };

  return (
    <div className="caretaker-dashboard">
      {/* ------------ NAV ------------- */}
      <nav className="ct-nav">
        <div className="ct-nav-left">
          <div className="circle-icon"></div>
          <h2 className="ct-nav-logo">CareNest</h2>
        </div>
        <div className="ct-nav-mid">
          <span onClick={() => navigate("/caretaker/dashboard")}>Parents</span>
          {/* <span onClick={() => navigate("/messages")}>Messages</span> */}
          <span onClick={() => navigate("/messages")} className="messages-tab">
            Messages
            {unreadMessages > 0 && (
              <span className="badge">{unreadMessages}</span>
            )}
          </span>
          <span onClick={() => navigate("/caretaker/bookings")}>Bookings</span>
          <span>How it works</span>
          <span>Pricing</span> 
        </div>
        <div className="header-actions">
          <NotificationBell />
          <FiLogOut className="icon" onClick={handleLogout} />
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Welcome */}
        <h2 className="welcome-text">Welcome back, {caretakerName || "Caretaker"}</h2>

        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Looking for a babysitting job? City or postal code"
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Next steps */}
        <div className="next-steps">
          <h3>Next steps</h3>
          <div className="step-cards">
            <div className="step-card" onClick={gotoCaretakerstep1}>
              <div className="card-text">
                <h4>Complete your profile</h4>
                <p>Make your profile stand out to parents looking for help.</p>
              </div>
              <span className="arrow">→</span>
            </div>
            <div className="step-card">
              <div className="card-text">
                <h4>Verify identity</h4>
                <p>To increase safety, we ask everyone to verify their government ID before communicating.</p>
              </div>
              <span className="arrow">→</span>
            </div>
            <div className="step-card">
              <div className="card-text">
                <h4>Ask for 2 references</h4>
                <p>References build trust and improve your visibility to families.</p>
              </div>
              <span className="arrow">→</span>
            </div>
          </div>
          <a href="#" className="view-all-link">View all steps</a>
        </div>

        {/* Families section */}
        <div className="jobs-section">
          <h2>Connect with families who need your care</h2>
          {loading ? (
            <p>Loading parents...</p>
          ) : parents.length === 0 ? (
            <p>No parents found at the moment.</p>
          ) : (
            <div className="jobs-placeholder">
              {parents.map((parent) => (
                <div
                  key={parent._id}
                  className="job-card"
                  onClick={() => openParentProfile(parent._id)}
                >
                  <img
                    src={
                      parent.photo
                        ? `${API_URL}${parent.photo}`
                        : "/images/parent-placeholder.png"
                    }
                    alt={parent.fullName || "Parent"}
                    className="job-card-image" 
                  />
                  <div className="job-card-details">
                    <h3>{parent.fullName}</h3>
                    <p>{parent.city}</p>
                    <p>
                      {parent.numberOfChildren} child • Rs {parent.hourlyRate}/hr
                    </p>
                  </div>
                  <span className="arrow">→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaretakerDashboard;