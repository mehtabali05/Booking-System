// src/pages/AdminDashboard/UserRow.jsx
import React from "react";

const UserRow = ({ user, onDeleted }) => {
  const handleDelete = async () => {
    if (!window.confirm("Delete this user?")) return;
    await fetch(`/api/admin/user/${user._id}`, { method: "DELETE" });
    onDeleted();
  };

  // quick in-place edit example (toggle verified flag)
  const handleToggleVerified = async () => {
    // example update; adjust to your schema
    await fetch(`/api/admin/user/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !user.verified }),
    });
    onDeleted(); // refresh
  };

  return (
    <div className="user-row">
      <div className="col name">{user.name || "-"}</div>
      <div className="col email">{user.email}</div>
      <div className="col role">{user.role}</div>
      <div className="col actions">
        <button onClick={() => window.open(`/admin/user/${user._id}`, "_blank")}>View</button>
        <button onClick={handleToggleVerified}>Toggle</button>
        <button className="danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default UserRow;
