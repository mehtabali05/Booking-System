// src/pages/AdminDashboard/UserList.jsx
import React, { useEffect, useState } from "react";
import UserRow from "./UserRow";

const UserList = ({ role }) => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/admin/users?role=${role}`);
    const data = await res.json();
    console.log("Fetched users:", data);
    setUsers(data);
  } catch (err) {
    console.error("Fetch error:", err);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, [role]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!users || users.length === 0) return <div className="empty">No users found.</div>;

  return (
    <div className="user-list">
      <div className="list-headers">
        <span>Name</span><span>Email</span><span>Role</span><span>Actions</span>
      </div>
      {users.map((u) => (
        <UserRow key={u._id} user={u} onDeleted={fetchUsers} />
      ))}
    </div>
  );
};

export default UserList;
