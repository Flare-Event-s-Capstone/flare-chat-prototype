import React, { useState } from "react";
import "../styles/ChatPage.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

function ChatPage() {
  const [chats, setChats] = useState({
    "Leon K": ["Hey there!", "How’s it going?"],
    "Coral J": ["Hi! Wanna meetup?"],
    "Ada W": ["Hi"],
  });

  const [activeUser, setActiveUser] = useState("Leon K");

  const handleSendMessage = (newMessage) => {
    if (newMessage.trim() === "") return;

    setChats({
      ...chats,
      [activeUser]: [...chats[activeUser], newMessage],
    });
  };

  return (
    <div className="chat-container">
      <Sidebar
        users={Object.keys(chats)}
        activeUser={activeUser}
        onSelectUser={setActiveUser}
      />
      <div className="chat-main">
        <ChatWindow messages={chats[activeUser]} />
        <ChatInput onSend={handleSendMessage} />

       <img src={`${import.meta.env.BASE_URL}flare.png`} alt="Flare Logo" className="flare-watermark" />
      </div>
    </div>
  );
}

export default ChatPage;
