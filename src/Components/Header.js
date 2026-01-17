import React from "react";
import { useLocation } from "react-router-dom";
import "../Components/Header.css";import { Link } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <header
      className="navbar"
      style={{
        backgroundColor: isLoginPage ? "#3e4a52" : "#3e4a52", 
      }}
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-mark">◯</span>
          <h1>CareNest</h1>
        </div>

         {!isLoginPage && (
        <nav className="navbar-links">
          <a>Babysitters</a>
          <a>Babysitting jobs</a>
          <a>How it works</a>
          <a>Pricing</a>
        </nav>
         )}

        <div className="navbar-buttons">
        <Link to="/login">
    <button className="login-btn">Log in</button>
        </Link> 
        <Link to="/signup">
    <button className="signup-btn">Sign up</button>
  </Link>
        
        </div>
      </div>
    </header>
  );
};

export default Header;
