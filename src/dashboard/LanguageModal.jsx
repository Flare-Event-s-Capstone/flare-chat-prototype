import { useState } from "react";
import Modal from "./Modal";

const languageOptions = [
  "English",
  "French",
  "Mandarin",
  "Cantonese",
  "Punjabi",
  "Spanish",
  "Arabic",
  "Tagalog",
];

export default function LanguageModal({ open, onClose }) {
  const [language, setLanguage] = useState("English");

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: save preferred language later
    console.log({ language });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Language">
      <form className="modal-form" onSubmit={handleSave}>
        <div className="modal-field">
          <label className="modal-label">Preferred Language</label>
          <select
            className="modal-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-button secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="modal-button primary">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}