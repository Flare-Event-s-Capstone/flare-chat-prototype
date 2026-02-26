import { useEffect, useState } from "react";
import "./Modal.css";
import { t } from "../util/i18n";
import { updateMySettings } from "../services/api";

export default function NotificationsSection({ me, onMeSettingsUpdated }) {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [matchAlerts, setMatchAlerts] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = me?.settings || {};
    if (typeof s.emailnotifs === "boolean") setEmailNotifs(s.emailnotifs);
    if (typeof s.pushnotifs === "boolean") setPushNotifs(s.pushnotifs);
    if (typeof s.matchalerts === "boolean") setMatchAlerts(s.matchalerts);
  }, [me]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const patch = {
      emailnotifs: emailNotifs,
      pushnotifs: pushNotifs,
      matchalerts: matchAlerts,
    };

    try {
      setSaving(true);
      await updateMySettings(patch);

      // update parent state so UI reflects saved values without refetching
      onMeSettingsUpdated?.(patch);
    } catch (err) {
      setError(err?.message || "Failed to save notification settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <div className="modal-section">
        <h3 className="modal-section-title">{t("notificationsTitle")}</h3>

        {error && <p className="modal-error">{error}</p>}

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={emailNotifs}
            onChange={(e) => setEmailNotifs(e.target.checked)}
          />
          {t("emailNotifications")}
        </label>

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={pushNotifs}
            onChange={(e) => setPushNotifs(e.target.checked)}
          />
          {t("pushNotifications")}
        </label>

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={matchAlerts}
            onChange={(e) => setMatchAlerts(e.target.checked)}
          />
          {t("matchAlerts")}
        </label>
      </div>

      <div className="modal-footer">
        <button type="submit" className="modal-button primary" disabled={saving}>
          {saving ? (t("saving") || "Saving...") : t("save")}
        </button>
      </div>
    </form>
  );
}
