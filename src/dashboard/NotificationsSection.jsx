import { useEffect, useState } from "react";
import "./Modal.css";

export default function NotificationsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [matchAlerts, setMatchAlerts] = useState(true);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("prefs_notifications") || "{}");
      if (typeof saved.emailNotifs === "boolean") setEmailNotifs(saved.emailNotifs);
      if (typeof saved.pushNotifs === "boolean") setPushNotifs(saved.pushNotifs);
      if (typeof saved.matchAlerts === "boolean") setMatchAlerts(saved.matchAlerts);
    } catch {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "prefs_notifications",
      JSON.stringify({ emailNotifs, pushNotifs, matchAlerts })
    );
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <div className="modal-section">
        <h3 className="modal-section-title">Notifications</h3>

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={emailNotifs}
            onChange={(e) => setEmailNotifs(e.target.checked)}
          />
          Email notifications
        </label>

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={pushNotifs}
            onChange={(e) => setPushNotifs(e.target.checked)}
          />
          Push notifications
        </label>

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={matchAlerts}
            onChange={(e) => setMatchAlerts(e.target.checked)}
          />
          Match alerts
        </label>
      </div>

      <div className="modal-footer">
        <button type="submit" className="modal-button primary">
          Save
        </button>
      </div>
    </form>
  );
}
