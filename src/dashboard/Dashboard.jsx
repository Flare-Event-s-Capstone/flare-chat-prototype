import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Sidebar from "./Sidebar";
import MatchesPanel from "./MatchesPanel";
import SettingsPanel from "./SettingsPanel";
import EventsPanel from "./EventsPanel";

import { getMe } from "../services/api";
import { setLanguage } from "../util/i18n";
import { t } from "../util/i18n";

export default function Dashboard() {
  const [active, setActive] = useState("matches");
  const [me, setMe] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const didLoadRef = useRef(false);

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;

    async function loadMe() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return navigate("/", { replace: true });

        const user = await getMe();
        setMe(user);
        if (user?.settings?.language) setLanguage(user.settings.language);
      } catch (err) {
        console.error("loadMe failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/", { replace: true });
      }
    }

    loadMe();
  }, [navigate]);

  // close mobile nav when switching sections
  const handleSelect = (key) => {
    setActive(key);
    setMobileNavOpen(false);
  };

  const handleMeSettingsUpdated = (settingsPatch) => {
    setMe((prev) =>
      prev
        ? { ...prev, settings: { ...(prev.settings || {}), ...settingsPatch } }
        : prev
    );
    if (settingsPatch?.language) setLanguage(settingsPatch.language);
  };

  const titleMap = {
    messages: t("messages"),
    matches: t("matches"),
    events: t("events"),
    settings: t("settings"),
  };

  return (
    <div className="dashboard-layout">
      {/* Desktop sidebar (hidden on mobile via CSS) */}
      <Sidebar me={me} active={active} onSelect={handleSelect} />

      {/* Mobile topbar (only shows on mobile via CSS) */}
      <header className="mobile-topbar">
        <button
          className="hamburger"
          type="button"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={mobileNavOpen}
        >
          ☰
        </button>

        <div className="mobile-title">{titleMap[active] || ""}</div>

        <div className="mobile-avatar">
          {((me?.firstname?.[0] || "") + (me?.lastname?.[0] || "") || "U").toUpperCase()}
        </div>
      </header>

      {/* Mobile full-screen menu overlay */}
      {mobileNavOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <div className="mobile-menu-user">
                <div className="mobile-menu-name">
                  {me ? `${me.firstname ?? ""} ${me.lastname ?? ""}`.trim() : "Loading..."}
                </div>
                <div className="mobile-menu-email">{me?.email || "—"}</div>
              </div>

              <button
                className="mobile-close"
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mobile-menu-items">
              <button className="mobile-menu-item" onClick={() => handleSelect("messages")}>
                {t("messages")}
              </button>

              <button className="mobile-menu-item" onClick={() => handleSelect("matches")}>
                {t("matches")}
              </button>

              <button className="mobile-menu-item" onClick={() => handleSelect("events")}>
                {t("events")}
              </button>

              <button className="mobile-menu-item" onClick={() => handleSelect("settings")}>
                {t("settings")}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="dashboard-main">
        {active === "matches" && <MatchesPanel />}

        {active === "settings" && (
          <SettingsPanel me={me} onMeSettingsUpdated={handleMeSettingsUpdated} />
        )}

        {active === "messages" && (
          <div className="panel">
            <div className="panel-header">
              <h2></h2>
            </div>
            <div className="panel-empty"></div>
          </div>
        )}

        {active === "events" && <EventsPanel />}
      </main>
    </div>
  );
}
