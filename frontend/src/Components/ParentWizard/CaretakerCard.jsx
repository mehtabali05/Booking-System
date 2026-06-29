import React from "react";
import { useNavigate } from "react-router-dom";
import "./CaretakerCard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CaretakerCard = ({ caretaker }) => {
  const navigate = useNavigate();

  const handleClick = () => { 
    navigate(`/caretakers/profile/${caretaker._id}`);
  };

  const formatPreference = (value) => {
    if (value === "familyHome") return "At the family's home";
    if (value === "myHome") return "At my home";
    return "";
  };

  // Use caretaker.photo from DB
  const photoUrl = caretaker?.photo
  ? `${API_URL.replace(/\/$/, "")}${caretaker.photo}`
  : "/images/caretaker-placeholder.png";

  return (
    <article
      className="caretaker-card"
      aria-label={caretaker?.fullName || "Caretaker"}
      onClick={handleClick}
      role="button"
    >
      <div className="card-image">
        <img
          src={photoUrl}
          alt={
            caretaker?.fullName
              ? `${caretaker.fullName} profile`
              : "Caretaker profile"
          }
        />
      </div>
          {/* {JSON.stringify(caretaker,null,4)} */}
      <div className="card-body">
        <h3>{caretaker.fullName}</h3>
        <p className="city">{caretaker.city}</p>

        <div className="meta">
          {caretaker.education && <span>• {caretaker.education}</span>}
          {caretaker.languages?.length > 0 && (
            <span> • {caretaker.languages.join(", ")}</span>
          )}
        </div>

        {caretaker.skills?.length > 0 && (
          <div className="skills">
            {caretaker.skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="card-footer">
        <p className="preference">{formatPreference(caretaker.preference)}</p>
        </div>
      </div>
    </article>
  );
};

export default CaretakerCard;

