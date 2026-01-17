import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Parentprofile.css";

const API_URL = "http://localhost:5000";

const ParentProfile = () => {
  const { id } = useParams();
  const [parent, setParent] = useState(null);


  useEffect(() => {
  // --- CHANGE 1: Prevent fetching if id is the string "undefined" ---
  if (!id || id === "undefined") return;

  const token = localStorage.getItem("token"); // --- CHANGE 2: Get token ---

  fetch(`${API_URL}/api/parents/profile/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // --- CHANGE 3: Added Authorization Header ---
    }
  }) 
    .then(res => res.json())
    .then(data => {
      if (data.success) setParent(data.parent);
    })
    .catch(err => console.error(err));
}, [id]);

  if (!parent) return <p className="loading">Loading...</p>;

  const imageUrl = parent.photo
    ? `${API_URL}${parent.photo}`
    : "";

  return (
    <div className="babysits-wrapper">
      {/* HEADER */}
      <div className="bs-header">
        <img src={imageUrl} alt="Parent" className="bs-avatar" />

        <div className="bs-header-info">
          <h1>
            {parent.fullName}
            <span className="verified">✔</span>
          </h1>

          <p className="subtitle">
            Babysitting job in {parent.city || "Not provided"}
          </p>

          <div className="header-meta">
            <span>Hourly rate</span>
            <strong>PKR {parent.hourlyRate ?? "Not provided"}/hr</strong>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="bs-content">
        <div className="left">
          <p className="description">
            Job description: <br />
            <span>Not provided</span>
          </p>

          <h3>Number of children</h3>
          <p>{parent.numberOfChildren || "Not provided"}</p>

          <h3>Children ages</h3>
          <p>
            {parent.kidsAges?.length > 0
              ? parent.kidsAges.join(", ")
              : "Not provided"}
          </p>

          <h3>Babysitting schedule</h3>
          <p>
            {parent.babysittingSchedule?.length > 0
              ? parent.babysittingSchedule.join(", ")
              : "Not provided"}
          </p>

          <h3>Babysitting location</h3>
          <p>{parent.babysittingLocation || "Not provided"}</p>
        </div>

        <div className="right">
          <button className="contact-btn">
            Contact {parent.fullName}
          </button>

          <div className="contact-info">
            <p><strong>Phone:</strong> {parent.phone || "Not provided"}</p>
            <p><strong>Email:</strong> {parent.email || "Not provided"}</p>
            <p><strong>Address:</strong> {parent.address || "Not provided"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
