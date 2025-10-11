import React from "react";
import "../styles/ChatWindow.css";

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${index % 2 === 0 ? "left" : "right"}`}>
          {msg}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
