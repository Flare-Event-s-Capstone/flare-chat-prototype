import { useState } from "react";
import Dashboard from "./dashboard/Dashboard.jsx";
import Modal from "./dashboard/Modal.jsx";
import ChatPage from "./components/ChatPage.jsx"; 

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app-main-wrapper">
      <Dashboard onOpenChat={() => setIsChatOpen(true)} />

      <Modal 
        open={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        title="Messaging"
      >
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
          <ChatPage />
        </div>
      </Modal>
    </div>
  );
}

export default App;