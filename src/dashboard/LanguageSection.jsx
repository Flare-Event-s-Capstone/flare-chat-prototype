import { useEffect, useState } from "react";
import "./Modal.css";
import { updateMySettings } from "../services/api";

export default function LanguageSection({ me, onMeSettingsUpdated }) {
  const [language, setLanguage] = useState("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = me?.settings || {};
    if (typeof s.language === "string" && s.language.length) {
      setLanguage(s.language);
    }
  }, [me]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    const patch = { language };

    try {
      setSaving(true);
      await updateMySettings(patch);

      onMeSettingsUpdated?.(patch);
    } catch (err) {
      setError(err?.message || "Failed to save language");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <div className="modal-field">
        <label className="modal-label">Language</label>

        {error && <p className="modal-error">{error}</p>}

        <select
          className="modal-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="sp">Español</option>
        </select>
      </div>

      <div className="modal-footer">
        <button type="submit" className="modal-button primary" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
