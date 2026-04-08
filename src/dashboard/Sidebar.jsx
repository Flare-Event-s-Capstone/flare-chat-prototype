import "./Sidebar.css";
import { t } from "../util/i18n";
import NavItem from "./NavItem";

export default function Sidebar({ me }) {
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
				<NavItem label={t("matches")} to={"/dashboard"} />

				<NavItem label={t("events")} to={"/dashboard/events"} />

				<NavItem label={t("settings")} to={"/dashboard/settings"} />
      </nav>
    </aside>
  );
}
