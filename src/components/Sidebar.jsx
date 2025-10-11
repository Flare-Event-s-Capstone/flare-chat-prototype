import React from "react";
import "../styles/Sidebar.css";

function Sidebar({ users, activeUser, onSelectUser }) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Contacts</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li
            key={user}
            className={`user-item ${user === activeUser ? "active" : ""}`}
            onClick={() => onSelectUser(user)}
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
