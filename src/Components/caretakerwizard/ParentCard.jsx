import React from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ParentCard = ({ parent }) => {

  const photoUrl = parent?.photo
    ? `${API_URL}${parent.photo}` 
    : "/images/parent-placeholder.png";

  return (
    <article className="parent-card" aria-label={parent?.fullName || "Parent"}>
      {/* Image */}
      <div className="card-image">
        <img
          src={photoUrl}
          alt={
            parent?.fullName
              ? `${parent.fullName} profile`
              : "Parent profile"
          }
        />
      </div>

      {/* Body */}
      <div className="card-body">
        <h3>{parent.fullName || "Parent"}</h3>
        <p>{parent.city || "Unknown"}</p>
        <p>
          {parent.numberOfChildren || 0} child
          {(parent.numberOfChildren || 0) !== 1 ? "ren" : ""}
        </p>
        {parent.hourlyRate ? <p>Hourly: {parent.hourlyRate}</p> : null}
      </div>
    </article>
  );
};

export default ParentCard;