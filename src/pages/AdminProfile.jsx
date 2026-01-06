import React from "react";

export default function AdminProfile() {
  // TODO: Fetch admin info, allow update
  return (
    <div className="admin-profile">
      <h1>Admin Profile</h1>
      <p>Email: admin@example.com</p>
      <button>Change Password</button>
      <button>Logout</button>
    </div>
  );
}
