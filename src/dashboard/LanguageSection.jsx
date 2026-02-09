import { useEffect, useState } from "react";
import "./Modal.css";

export default function LanguageSection() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("prefs_language") || "{}");
      if (saved.language) setLanguage(saved.language);
    } catch {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "prefs_language",
      JSON.stringify({ language })
    );
  };

  return (
    <form className="modal-form" onSubmit={handleSave}>
      <div className="modal-field">
        <label className="modal-label">Language</label>
        <select
          className="modal-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>

      <div className="modal-footer">
        <button type="submit" className="modal-button primary">
          Save
        </button>
      </div>
    </form>
  );
}
