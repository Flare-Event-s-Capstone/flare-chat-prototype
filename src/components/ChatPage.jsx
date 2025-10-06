import React from "react";
import "../styles/ChatPage.css";
import  Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import  ChatInput from "./ChatInput";

function ChatPage() {
  return (
    <div className="chat-container">
      <Sidebar />
      <div className="chat-main">
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  );
}

export default ChatPage;