// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useState } from "react";
import Header from "../Header"; // your header import
import Sidebar from "./Slidebar";
import UserList from "./Userlist";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const [view, setView] = useState("caretakers");

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-wrap">
        <Sidebar view={view} setView={setView} />
        <main className="admin-main">
          <div className="admin-top">
            <h2>Admin dashboard</h2>
            <p>Manage {view === "caretakers" ? "Caretakers" : "Parents"}</p>
          </div>

          {/* UserList will fetch based on role prop */}
          <UserList role={view === "caretakers" ? "caretaker" : "parent"} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
