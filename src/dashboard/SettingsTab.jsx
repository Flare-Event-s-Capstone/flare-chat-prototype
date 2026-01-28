import "./SettingsTab.css";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileModal from "./ProfileModal";
import LanguageModal from "./LanguageModal";
import NotificationModal from "./NotificationsModal";

export default function SettingsTab({ open, onClose }) {
  const overlayRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    function handleClick(e) {
      if (e.target === overlayRef.current) onClose();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const navigate = useNavigate();

  const handleLogout = () => {
    onClose();
    navigate("/");
  };

  const openProfile = () => {
    setProfileOpen(true);
    setLanguageOpen(false);
    setNotificationsOpen(false);
  };

  const openLanguage = () => {
    setLanguageOpen(true);
    setProfileOpen(false);
    setNotificationsOpen(false);
  };

  const openNotifications = () => {
    setNotificationsOpen(true);
    setProfileOpen(false);
    setLanguageOpen(false);
  };

  return (
    <>
      <div
        ref={overlayRef}
        className={`settings-overlay ${open ? "show" : ""}`}
        aria-hidden={!open}
      >
        <aside className={`settings-drawer ${open ? "open" : ""}`}>
          <div className="drawer-header">
            <h2>Settings</h2>
          </div>

          <div className="drawer-body">
            <div className="settings-card" onClick={openProfile}>
              Profile
            </div>
            <div className="settings-card" onClick={openLanguage}>
              Language
            </div>
            <div className="settings-card" onClick={openNotifications}>
              Notifications
            </div>
            <div className="settings-card" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </aside>
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <LanguageModal
        open={languageOpen}
        onClose={() => setLanguageOpen(false)}
      />
      <NotificationModal
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}