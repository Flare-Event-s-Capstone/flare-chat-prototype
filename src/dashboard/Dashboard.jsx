import { useEffect, useRef, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Sidebar from "./Sidebar";

import { getMe } from "../services/api";
import { setLanguage } from "../util/i18n";
import { t } from "../util/i18n";

export default function Dashboard() {
	const [me, setMe] = useState(null);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const navigate = useNavigate();
	const didLoadRef = useRef(false);
	const noPadding = useMatch("/dashboard/chat/:id")
	const [mobileTitle, setMobileTitle] = useState("");

	useEffect(() => {
		if (didLoadRef.current) return;
		didLoadRef.current = true;

		async function loadMe() {
			try {
				const token = localStorage.getItem("accessToken");
				if (!token) return navigate("/", { replace: true });

				const user = await getMe();
				setMe(user);
				if (user?.settings?.language) setLanguage(user.settings.language);
			} catch (err) {
				console.error("loadMe failed:", err);
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				navigate("/", { replace: true });
			}
		}

		loadMe();
	}, [navigate]);

	// close mobile nav when switching sections
	const handleSelect = (to) => {
		navigate(to);
		setMobileNavOpen(false);
	};

	const handleMeSettingsUpdated = (settingsPatch) => {
		setMe((prev) =>
			prev
				? { ...prev, settings: { ...(prev.settings || {}), ...settingsPatch } }
				: prev
		);
		if (settingsPatch?.language) setLanguage(settingsPatch.language);
	};

	const titleMap = {
		messages: t("messages"),
		matches: t("matches"),
		events: t("events"),
		settings: t("settings"),
	};

	return (
		<div className="dashboard-layout">
			{/* Desktop sidebar (hidden on mobile via CSS) */}
			<Sidebar me={me} onSelect={handleSelect} />

			{/* Mobile topbar (only shows on mobile via CSS) */}
			<header className="mobile-topbar">
				<button
					className="hamburger"
					type="button"
					onClick={() => setMobileNavOpen((v) => !v)}
					aria-label="Open menu"
					aria-expanded={mobileNavOpen}
				>
					☰
				</button>

				<div className="mobile-title">{mobileTitle || ""}</div>

				<div className="mobile-avatar">
					{((me?.firstname?.[0] || "") + (me?.lastname?.[0] || "") || "U").toUpperCase()}
				</div>
			</header>

			{/* Mobile full-screen menu overlay */}
			{mobileNavOpen && (
				<div className="mobile-menu-overlay" role="dialog" aria-modal="true">
					<div className="mobile-menu">
						<div className="mobile-menu-header">
							<div className="mobile-menu-user">
								<div className="mobile-menu-name">
									{me ? `${me.firstname ?? ""} ${me.lastname ?? ""}`.trim() : "Loading..."}
								</div>
								<div className="mobile-menu-email">{me?.email || "—"}</div>
							</div>

							<button
								className="mobile-close"
								type="button"
								onClick={() => setMobileNavOpen(false)}
								aria-label="Close menu"
							>
								✕
							</button>
						</div>

						<div className="mobile-menu-items">
							<button className="mobile-menu-item" onClick={() => handleSelect("/dashboard")}>
								{t("matches")}
							</button>

							<button className="mobile-menu-item" onClick={() => handleSelect("/dashboard/events")}>
								{t("events")}
							</button>

							<button className="mobile-menu-item" onClick={() => handleSelect("/dashboard/settings")}>
								{t("settings")}
							</button>
						</div>
					</div>
				</div>
			)}

			<main className={`dashboard-main ${noPadding ? "nopadding" : ""}`}>
				<Outlet context={{ me, setMobileTitle, handleMeSettingsUpdated }} />
			</main>
		</div>
	);
}
