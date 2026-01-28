import { useState } from "react";
import Modal from "./Modal";

export default function NotificationModal({ open, onClose }) {
  const [matchNew, setMatchNew] = useState(true);
  const [matchConfirmed, setMatchConfirmed] = useState(true);
  const [matchCancelled, setMatchCancelled] = useState(true);

  const [msgNew, setMsgNew] = useState(true);
  const [msgReactions, setMsgReactions] = useState(true);

  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [inApp, setInApp] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: save notification prefs later
    console.log({
      matchNew,
      matchConfirmed,
      matchCancelled,
      msgNew,
      msgReactions,
      email,
      push,
      inApp,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Notifications">
      <form className="modal-form" onSubmit={handleSave}>
        {/* Match Notifications */}
        <div className="modal-section">
          <h3 className="modal-section-title">Match Notifications</h3>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={matchNew}
              onChange={(e) => setMatchNew(e.target.checked)}
            />
            <span>New match found</span>
          </label>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={matchConfirmed}
              onChange={(e) => setMatchConfirmed(e.target.checked)}
            />
            <span>Match confirmed</span>
          </label>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={matchCancelled}
              onChange={(e) => setMatchCancelled(e.target.checked)}
            />
            <span>Match cancelled</span>
          </label>
        </div>

        {/* Messages */}
        <div className="modal-section">
          <h3 className="modal-section-title">Messages</h3>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={msgNew}
              onChange={(e) => setMsgNew(e.target.checked)}
            />
            <span>New message</span>
          </label>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={msgReactions}
              onChange={(e) => setMsgReactions(e.target.checked)}
            />
            <span>Message reactions</span>
          </label>
        </div>

        {/* General */}
        <div className="modal-section">
          <h3 className="modal-section-title">General</h3>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={email}
              onChange={(e) => setEmail(e.target.checked)}
            />
            <span>Enable email notifications</span>
          </label>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={push}
              onChange={(e) => setPush(e.target.checked)}
            />
            <span>Enable push notifications</span>
          </label>
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={inApp}
              onChange={(e) => setInApp(e.target.checked)}
            />
            <span>In-app alerts</span>
          </label>
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