import React, { useState } from "react";
import "../styles/ChatInput.css";

function ChatInput({ onSend }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    onSend(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type a message ..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatInput;
