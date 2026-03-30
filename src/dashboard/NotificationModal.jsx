import { useEffect } from "react";
import "./Modal.css";

export default function NotificationModal({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="notification-overlay">
      <div
        className="notification-modal"
        role="status"
        aria-live="polite"
      >
        <div className="notification-content">
          <h4 className="notification-title">{notification.title}</h4>
          {notification.body && (
            <p className="notification-body">{notification.body}</p>
          )}
        </div>

        <button
          type="button"
          className="notification-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}