import React from "react";
import "../Components/dashboard.css";
import heroImg from "./dashboard.png";

const Dashboard = () => {
  return (
    <>
      {/* Original hero section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h2>Childcare you can rely on</h2>
            <p className="trusted">Trusted by Millions Pakistani's </p>

            <div className="tabs">
              <button className="tab active">Babysitters</button>
              <button className="tab">Nannies</button>
              <button className="tab">Jobs</button>
            </div>

            <div className="search-bar">
              <input placeholder="City or postal code" />
              <button className="search-btn" aria-label="search">
                🔍
              </button>
            </div>

            <button className="cta">Get started for free</button>

            <div className="badges">
              <span className="stars">
                ★★★★★ <small>4.8 / 5</small>
              </span>
            </div>
          </div>

          <div className="hero-graphic">
            <img src={heroImg} alt="CareNest" />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="features">
        <div className="features-inner">
          <h2 className="features-title">
            Find the care that fits your family best. Anytime, anywhere.
          </h2>

          <div className="features-grid">
            <div className="features-graphic">
              <div className="photo-circle">
                {/* Place your image here */}
                 <img src={heroImg} alt="Mother and child" /> 
              </div>
            </div>

            <div className="features-cards">
              <div className="feature-card">
                <h3>
                  We’ve got your babysitter covered. Now it's your turn to
                  shine. ✨
                </h3>
                <ul>
                  <li>Make some fun plans</li>
                  <li>Tackle those important to do's</li>
                  <li>Or simply take a moment to relax</li>
                </ul>
              </div>

              <div className="feature-card">
                <h3>Always reply to messages for free</h3>
                <p>
                  Basic features free for all members. Parents get extra
                  benefits with Premium.
                </p>
                <span className="learn-more">Learn more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety section (last section) */}
      <section className="safety">
        <div className="safety-inner">
          <h2 className="safety-title">With kids, safety always comes first</h2>

          <div className="safety-grid">
            <div className="safety-card">
              <h3>That's why safety is our priority</h3>
              <ul className="safety-list">
                <li>All members verify their identity</li>
                <li>
                  Constant monitoring of messages, profiles and support
                </li>
                <li>Reviews and references</li>
                <li>Basic background check</li>
              </ul>
              <a className="safety-learn-more" href="/trust">Learn more</a>
            </div>

            {/* <div className="safety-illustration">
              <img src={} alt="Safety verification illustration" />
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
