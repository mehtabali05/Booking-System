import React, { useState } from "react";
import "./Signup.css";
import trust from "./trust.png";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // ❌ Validation Errors State
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    let temp = {};

    // Name
    if (!formData.name.trim()) {
      temp.name = "Full name is required";
    }

    // Email
    if (!formData.email.trim()) {
      temp.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      temp.email = "Invalid email format";
    }

    // Password
    if (!formData.password.trim()) {
      temp.password = "Password is required";
    } else if (formData.password.length < 6) {
      temp.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!formData.confirmPassword.trim()) {
      temp.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = "Passwords do not match";
    }

    // Role
    if (!formData.role) {
      temp.role = "Please select a role";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ STOP if validation fails
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Signup successful!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);

        navigate("/otp-verification", {
          state: {
            email: formData.email,
          },
        });

        // console.log("✅ User created:", data);
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Check your backend connection.");
    }
  };

  return (
    <div className="signup-page">
      {/* Header */}
      <header className="signup-header">
        <div className="logo">CareNest</div>
        <nav className="nav-links">
          <Link to="/login">Log in</Link>
          <button className="signup-btn">Sign up</button>
        </nav>
      </header>

      {/* Testimonials Auto-Scroll */}
      <section className="testimonials">
        <div className="scrolling-wrapper">
          <div className="testimonial-card">
            🌟 “CareNest helped me find a reliable babysitter!” – Son Pari
          </div>
          <div className="testimonial-card">
            💖 “I feel safe knowing my caretaker is verified.” – Rachit
          </div>
          <div className="testimonial-card">
            🧸 “Simple, easy to use, and trustworthy.” – Ahmed
          </div>
          <div className="testimonial-card">
            👶 “The daily updates give me peace of mind!” – Zara
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section className="signup-content">
        <div className="left-side">
          <img src={trust} alt="signup" />
        </div>

        <div className="right-side">
          <h1>Create your CareNest Account</h1>
          <h3>Join and start caring with confidence</h3>

          <form className="signup-form" onSubmit={handleSubmit}>
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}

            {/* Role */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="parent">Parent</option>
              <option value="caretaker">Caretaker</option>
            </select>
            {errors.role && <p className="error-message">{errors.role}</p>}

            <button type="submit">Sign up</button>
          </form>
        </div>
      </section>

      {/* Wave Section */}
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

export default Signup;
