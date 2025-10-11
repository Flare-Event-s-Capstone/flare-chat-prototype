import React, { useState } from "react";
import "../styles/ChatPage.css";
import  Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import  ChatInput from "./ChatInput";

function ChatPage() {
  const [message, setMessages] = useState(["Hi!", "Welcome to Flare Chat!"]);

  const handleSendMessage = (newMessage) => {
    if (newMessage.trim() == "") return;
    setMessages([...messages, newMessage]);
  };

  return (
     <div className="chat-container">
      <Sidebar />
      <div className="chat-main">
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatPage;