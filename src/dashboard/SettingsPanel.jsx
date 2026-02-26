import { useState } from "react";
import "./Panel.css";
import { t } from "../util/i18n";

import ProfileSection from "./ProfileSection";
import LanguageSection from "./LanguageSection";
import NotificationsSection from "./NotificationsSection";

import { logoutUser } from "../services/api";

export default function SettingsPanel({ me, onMeSettingsUpdated }) {
  const [tab, setTab] = useState("profile");

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
        <h2>{t("settings")}</h2>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="panel-btn secondary"
            type="button"
            onClick={() => setTab("profile")}
            style={{ opacity: tab === "profile" ? 1 : 0.75 }}
          >
            {t("profile")}
          </button>

          <button
            className="panel-btn secondary"
            type="button"
            onClick={() => setTab("language")}
            style={{ opacity: tab === "language" ? 1 : 0.75 }}
          >
            {t("language")}
          </button>

          <button
            className="panel-btn secondary"
            type="button"
            onClick={() => setTab("notifications")}
            style={{ opacity: tab === "notifications" ? 1 : 0.75 }}
          >
            {t("notifications")}
          </button>
        </div>
      </div>

      {tab === "profile" && <ProfileSection me={me} />}

      {tab === "language" && (
        <LanguageSection me={me} onMeSettingsUpdated={onMeSettingsUpdated} />
      )}

      {tab === "notifications" && (
        <NotificationsSection me={me} onMeSettingsUpdated={onMeSettingsUpdated} />
      )}

      <button type="button" onClick={handleLogout} className="logout-fixed">
        {t("logout")}
      </button>
    </div>
  );
}
