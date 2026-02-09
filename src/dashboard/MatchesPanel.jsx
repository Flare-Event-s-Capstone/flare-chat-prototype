import { useEffect, useState } from "react";
import "./Panel.css";
import { getAndProcessMatches } from "../services/apiHelpers";
import { useNavigate } from "react-router-dom";

export default function MatchesPanel() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await getAndProcessMatches();
        if (!alive) return;
        setMatches(Array.isArray(data) ? data : []);
      } catch {
        if (!alive) return;
        setMatches([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Matches</h2>
      </div>

      <div className="panel-grid">
        {loading && <div className="panel-empty">Loading...</div>}

        {!loading &&
          matches.map((m) => (
            <div key={m.matchId} className="panel-card">
              <div className="panel-card-title">
                {m?.otherUser?.firstname} {m?.otherUser?.lastname}
              </div>

              <div className="panel-card-actions">
                <button
                  className="panel-btn"
                  onClick={() => navigate(`/chat/${m.matchId}`)}
                  type="button"
                >
                  Message
                </button>

                <button className="panel-btn secondary" type="button" disabled>
                  View profile
                </button>
              </div>
            </div>
          ))}

        {!loading && matches.length === 0 && (
          <div className="panel-empty">No matches yet.</div>
        )}
      </div>
    </div>
  );
}
