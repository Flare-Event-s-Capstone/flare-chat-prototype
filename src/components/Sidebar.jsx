import React from "react";
import "../styles/Sidebar.css";

function Sidebar({ matches, activeChat, onSelectChat }) {
  return (
    <div className="contacts">
      <h2 className="sidebar-title">Matches</h2>
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
