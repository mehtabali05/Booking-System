import React, { useState } from "react";
import "./Login.css";
import trust from "./trust.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  // ✅ FRONT-END VALIDATION FUNCTION
  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "parent") {
        navigate("/parent-dashboard");
      } else if (data.user.role === "caretaker") {
        navigate("/caretakerdashboard");
      } else if (data.user.role === "admin") {
        navigate("/AdminDashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      {/* Main Section */}
      <section className="login-content">
        <div className="left-side">
          <img src={trust} alt="Carenest" />
        </div>

        <div className="right-side">
          <h1>Join and make some fun plans</h1>
          <h3>Log in or sign up</h3>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="forgot-password">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password-btn"
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit">Continue</button>

            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-container">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#d04d6a"
            fillOpacity="1"
            d="M0,192L80,170.7C160,149,320,107,480,117.3C640,128,800,192,960,213.3C1120,235,1280,213,1360,202.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="footer-section">
        <h3>Join Million+ Pakistani's Satisfied Families And Babysitters</h3>
        <p>
          ★★★★★ <span>4.7 / 5</span>
        </p>
      </footer>

      {/* Bottom Footer */}
      <section className="bottom-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Babysits</h4>
            <a href="#">How it works</a>
            <a href="#">Help</a>
            <a href="#">Terms & Privacy</a>
            <a href="#">Pricing</a>
            <a href="#">Company details</a>
            <a href="#">Babysits for Work</a>
            <a href="#">Community standards</a>
          </div>

          <div className="footer-col">
            <h4>Discover</h4>
            <a href="#">About us</a>
            <a href="#">Tips & Articles</a>
            <a href="#">Trust & Safety</a>
            <a href="#">Babysits Shop</a>
            <a href="#">Partners</a>
            <a href="#">Babysits for Special Needs</a>
          </div>

          <div className="footer-col">
            <h4>Popular</h4>
            <a href="#">Babysitter New York</a>
            <a href="#">Babysitter Los Angeles</a>
            <a href="#">Babysitter Brooklyn</a>
            <a href="#">Babysitter Chicago</a>
            <a href="#">Babysitter Houston</a>
            <a href="#">Babysitting jobs</a>
          </div>
        </div>

        <hr />

        <div className="social-section">
          <h4>Follow us on</h4>
          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-tiktok"></i>
            <i className="fab fa-linkedin"></i>
            <i className="fab fa-pinterest"></i>
            <i className="fab fa-youtube"></i>
            <i className="fab fa-twitter"></i>
          </div>
          <p>© Babysits B.V.</p>
        </div>
      </section>
    </div>
  );
};

export default Login;