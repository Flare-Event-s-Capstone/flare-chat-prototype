import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Sidebar from "./Sidebar";
import MatchesPanel from "./MatchesPanel";
import SettingsPanel from "./SettingsPanel";

import { getMe } from "../services/api";

export default function Dashboard() {
	const [active, setActive] = useState("matches"); // messages | matches | events | settings
	const [me, setMe] = useState(null);
	const navigate = useNavigate();

  useEffect(() => {
    async function loadMe() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return navigate("/", { replace: true });

        const user = await getMe();
        setMe(user);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/", { replace: true });
      }
    }
    loadMe();
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar me={me} active={active} onSelect={setActive} />

      <main className="dashboard-main">
        {active === "matches" && <MatchesPanel />}

        {active === "settings" && <SettingsPanel me={me} />}

        {active === "messages" && (
          <div className="panel">
            <div className="panel-header">
              <h2>Messages</h2>
            </div>
            <div className="panel-empty"></div>
          </div>
        )}

        {active === "events" && (
          <div className="panel">
            <div className="panel-header">
              <h2>Events</h2>
            </div>
            <div className="panel-empty"></div>
          </div>
        )}
      </main>
    </div>
  );
}
