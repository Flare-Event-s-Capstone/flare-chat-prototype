import "./Sidebar.css";

export default function Sidebar({ me, active, onSelect }) {
  const initials =
    (me?.firstname?.[0] || "") + (me?.lastname?.[0] || "") || "U";

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">{initials.toUpperCase()}</div>
        <div className="sidebar-user">
          <div className="sidebar-name">
            {me ? `${me.firstname ?? ""} ${me.lastname ?? ""}`.trim() : "Loading..."}
          </div>
          <div className="sidebar-email">{me?.email || "—"}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-item ${active === "messages" ? "active" : ""}`}
          onClick={() => onSelect("messages")}
          type="button"
        >
          Messages
        </button>

        <button
          className={`sidebar-item ${active === "matches" ? "active" : ""}`}
          onClick={() => onSelect("matches")}
          type="button"
        >
          Matches
        </button>

        <button
          className={`sidebar-item ${active === "events" ? "active" : ""}`}
          onClick={() => onSelect("events")}
          type="button"
        >
          Events
        </button>

        <button
          className={`sidebar-item ${active === "settings" ? "active" : ""}`}
          onClick={() => onSelect("settings")}
          type="button"
        >
          Settings
        </button>
      </nav>
    </aside>
  );
}
