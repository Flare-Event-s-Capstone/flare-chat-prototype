import React from "react";
import "../styles/Sidebar.css";

function Sidebar({ matches, activeChat, onSelectChat }) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Contacts</h2>
      <ul className="user-list">
        {matches.map((match, index) => (
          <li
            key={index}
            className={`user-item ${match.matchid === activeChat ? "active" : ""}`}
            onClick={() => onSelectChat(match.matchid)}
          >
            {match.otherUser.firstname}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
