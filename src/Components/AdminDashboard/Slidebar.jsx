// src/pages/AdminDashboard/Sidebar.jsx
import React from "react";

const Sidebar = ({ view, setView }) => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">Admin</div>

      <ul className="admin-menu">
        <li className={view === "caretaker" ? "active" : ""} onClick={() => setView("caretaker")}>
          Caretakers
        </li>
        <li className={view === "parent" ? "active" : ""} onClick={() => setView("parent")}>
          Parents
        </li>
    
      </ul>
    </aside>
  );
};

export default Sidebar;
