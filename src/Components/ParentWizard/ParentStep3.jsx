import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const ParentStep3 = () => {
  const navigate = useNavigate();

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const times = ["Morning", "Afternoon", "Evening", "Night"];

  // Load saved data if available
  const savedData = JSON.parse(localStorage.getItem("parentStep3")) || null;

  const initialState =
    savedData ||
    times.reduce((acc, time) => {
      acc[time] = days.reduce((dayObj, day) => {
        dayObj[day] = false;
        return dayObj;
      }, {});
      return acc;
    }, {});

  const [availability, setAvailability] = useState(initialState);

  // ✅ Helper to merge profile data into localStorage
  function updateProfile(key, updates) {
    const existing = JSON.parse(localStorage.getItem(key)) || {};
    const updated = { ...existing, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  }

  useEffect(() => {
    // STEP 3 (Availability)
    localStorage.setItem("parentStep3", JSON.stringify(availability));

    updateProfile("parentProfile", {
      availability: availability,
    });
  }, [availability]);

  const handleCheckboxChange = (time, day) => {
    setAvailability({
      ...availability,
      [time]: {
        ...availability[time],
        [day]: !availability[time][day],
      },
    });
  };

  return (
    <div className="availability-page">
      <Header />

      <div className="availability-container">
        <h2>When do you need a babysitter?</h2>

        <div className="availability-table">
          <div className="table-header">
            <div className="time-cell"></div>
            {days.map((day) => (
              <div key={day} className="day-cell">
                {day}
              </div>
            ))}
          </div>

          {times.map((time) => (
            <div key={time} className="table-row">
              <div className="time-cell">{time}</div>
              {days.map((day) => (
                <div key={day} className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={availability[time][day]}
                    onChange={() => handleCheckboxChange(time, day)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button
            className="back-btn"
            onClick={() => navigate("/parent-step2")}
          >
            Back
          </button>

          <button
            className="next-btn"
            onClick={() => navigate("/parent-step4")}
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <section className="bottom-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Babysits</h4>
            <button
              type="button"
              onClick={() => console.log("How it works clicked")}
              className="footer-link"
            >
              How it works
            </button>
            <button type="button" className="footer-link">
              Help
            </button>
            <button type="button" className="footer-link">
              Terms & Privacy
            </button>
            <button type="button" className="footer-link">
              Pricing
            </button>
          </div>
          <div className="footer-col">
            <h4>Discover</h4>
            <button type="button" className="footer-link">
              About us
            </button>
            <button type="button" className="footer-link">
              Tips & Articles
            </button>
            <button type="button" className="footer-link">
              Trust & Safety
            </button>
          </div>
          <div className="footer-col">
            <h4>Popular</h4>
            <button type="button" className="footer-link">
              Babysitter Karachi
            </button>
            <button type="button" className="footer-link">
              Babysitter Lahore
            </button>
            <button type="button" className="footer-link">
              Babysitting jobs
            </button>
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

export default ParentStep3;
