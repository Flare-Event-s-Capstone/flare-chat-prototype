import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Sidebar from "./Sidebar";
import MatchesPanel from "./MatchesPanel";
import SettingsPanel from "./SettingsPanel";
import EventsPanel from "./EventsPanel";

import { getMe } from "../services/api";
import { setLanguage } from "../util/i18n";

export default function Dashboard() {
  const [active, setActive] = useState("matches");
  const [me, setMe] = useState(null);
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

  const handleMeSettingsUpdated = (settingsPatch) => {
    setMe((prev) =>
      prev
        ? { ...prev, settings: { ...(prev.settings || {}), ...settingsPatch } }
        : prev
    );
    if (settingsPatch?.language) setLanguage(settingsPatch.language);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar me={me} active={active} onSelect={setActive} />

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
