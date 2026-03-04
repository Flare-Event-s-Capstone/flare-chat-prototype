import { useEffect, useState } from "react";
import "./Panel.css";
import { getAndProcessMatches } from "../services/apiHelpers";
import { useNavigate } from "react-router-dom";
import { t } from "../util/i18n";

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
        setMatches(Object.values(data));
      } catch (e) {
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
        <h2>{t("matches")}</h2>
      </div>

      <div className="panel-grid">
        {loading && <div className="panel-empty">{t("loading")}</div>}

        {!loading &&
          matches.map((m, index) => (
            <div key={index} className="panel-card">
              <div className="panel-card-title">
                {m?.otherUser?.firstname} {m?.otherUser?.lastname}
              </div>

              <div className="panel-card-actions">
                <button
                  className="panel-btn"
                  onClick={() => navigate(`/chat/${m.matchId}`)}
                  type="button"
                >
                  {t("message")}
                </button>

                <button className="panel-btn secondary" type="button" disabled>
                  {t("viewProfile")}
                </button>
              </div>
            </div>
          ))}

        {!loading && matches.length === 0 && (
          <div className="panel-empty">{t("noMatches")}</div>
        )}
      </div>
    </div>
  );
}
