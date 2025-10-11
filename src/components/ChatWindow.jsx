import React from "react";
import "../styles/ChatWindow.css";

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          {msg}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
