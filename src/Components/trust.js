import React from "react";
import "./trust.css";
import heroImg from "./trust.png";
import { Link } from "react-router-dom";


const Trust = () => {
  return (
    <div className="trust-page">
      {/* Header/Navbar */}
      <header className="trust-header">
        <div className="trust-logo">CareNest</div>
        <ul className="trust-nav">
          <li className="active">Trust & Safety</li>
          <li>Community standards</li>
          <li>Intake form</li>
        </ul>
        <div className="trust-auth">
          <Link to="/login" className="login">Log in</Link>
          <button className="signup">Sign up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="trust-hero">
        <div className="hero-text">
          <h1>With kids, Safety Always Comes First</h1>
        </div>
        <div className="hero-img">
          {/* Replace with your real image */}
          <img src={heroImg} alt="Mom and child" />
        </div>
      </section>

      {/* Curved Waves */}
      <div className="trust-waves">
        <svg viewBox="0 0 1440 320" className="wave teal">
          <path
            fill="#2b6060"
            d="M0,192L80,202.7C160,213,320,235,480,240C640,245,800,235,960,213.3C1120,192,1280,160,1360,144L1440,128L1440,320L0,320Z"
          ></path>
        </svg>
        <svg viewBox="0 0 1440 320" className="wave pink">
          <path
            fill="#c9506c"
            d="M0,192L80,170.7C160,149,320,107,480,117.3C640,128,800,192,960,213.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Footer Section */}
      <footer className="trust-footer">
        <p>
          Finding the right babysitter or family can feel overwhelming, we get it.
          Your safety and peace of mind matter most to us. That’s why we've built
          a community you can trust, with tools and safeguards that work for everyone.
          Here's how we keep things safe and transparent.
        </p>
      </footer>

      {/* Trust & Safety Measures Cards */}
      <section className="trust-cards">
        <div className="cards-wrap">
          <h2 className="cards-title">Babysits Trust & Safety Measures</h2>

          <div className="cards-grid">
            <article className="tcard">
              <div className="tcard-icon">
                {/* Insert icon/image here */}
              </div>
              <h3>Government ID Verification</h3>
              <p>
                You deserve to feel confident that people on Babysits are who they say
                they are. Whether you're a parent looking for trusted care or a
                babysitter seeking great families, we ask everyone to verify their identity.
              </p>
              <Link to="/id-verification" className="tcard-link">How ID verification works</Link>
            </article>

            <article className="tcard">
              <div className="tcard-icon">
                {/* Insert icon/image here */}
              </div>
              <h3>Basic background check</h3>
              <p>
                We want you to be confident that people on Babysits are trustworthy.
                One way we do that is by having members in the United States perform a
                background check.
              </p>
              <Link to="/background-check" className="tcard-link">Learn more</Link>
            </article>

            <article className="tcard">
              <div className="tcard-icon">
                {/* Insert icon/image here */}
              </div>
              <h3>Reviews and References</h3>
              <p>
                Learn more about babysitters and parents by reading references and
                reviews from other community members.
              </p>
            </article>

            <article className="tcard">
              <div className="tcard-icon">
                {/* Insert icon/image here */}
              </div>
              <h3>Secure Messaging</h3>
              <p>
                Stay safe with our messaging service, which automatically screens for
                fraud and suspicious behavior.
              </p>
            </article>

            <article className="tcard">
                <div className="tcard-icon">
                    </div>
                    <h3>Secure Payments</h3>
                    <p>
                        
                    </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

<h2>Babysits Trust & Safety Measures</h2>



export default Trust;

