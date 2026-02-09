import { useState } from "react";
import "./Panel.css";

import ProfileSection from "./ProfileSection";
import LanguageSection from "./LanguageSection";
import NotificationsSection from "./NotificationsSection";

import { logoutUser } from "../services/api";

export default function SettingsPanel({ me }) {
  const [tab, setTab] = useState("profile"); // profile | language | notifications

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn("Logout API failed:", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.replace("/");
    }
  };

  return (
    <div className="panel">
      <div
        className="panel-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Settings</h2>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="panel-btn secondary"
            type="button"
            onClick={() => setTab("profile")}
            style={{ opacity: tab === "profile" ? 1 : 0.75 }}
          >
            Profile
          </button>

          <button
            className="panel-btn secondary"
            type="button"
            onClick={() => setTab("language")}
            style={{ opacity: tab === "language" ? 1 : 0.75 }}
          >
            Language
          </button>

          <button
            className="panel-btn secondary"
            type="button"
            onClick={() => setTab("notifications")}
            style={{ opacity: tab === "notifications" ? 1 : 0.75 }}
          >
            Notifications
          </button>
        </div>
      </div>

      {tab === "profile" && <ProfileSection me={me} />}
      {tab === "language" && <LanguageSection />}
      {tab === "notifications" && <NotificationsSection />}

    <button
        type="button"
        onClick={handleLogout}
        className="logout-fixed"
    >
        Log out
    </button>


    </div>
  );
}
