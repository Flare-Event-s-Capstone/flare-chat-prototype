import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Sidebar from "./Sidebar";
import NotificationModal from "./NotificationModal";

import { getMe } from "../services/api";
import { getAndProcessMatches } from "../services/apiHelpers";
import { socket } from "../services/ws";
import { setLanguage } from "../util/i18n";
import { t } from "../util/i18n";

export default function Dashboard() {
	const [me, setMe] = useState(null);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const navigate = useNavigate();
	const location = useLocation();
	const didLoadRef = useRef(false);
	const didLoadMatchesRef = useRef(false);
	const matchesRef = useRef({});
	const messageCountsRef = useRef({});
	const messageTimersRef = useRef({});
	const noPadding = useMatch("/dashboard/chat/:id")
	const [mobileTitle, setMobileTitle] = useState("");

	const showNotification = (nextNotification) => {
		setNotifications((prev) => {
			if (nextNotification.id) {
				const existingIndex = prev.findIndex((n) => n.id === nextNotification.id);

				if (existingIndex !== -1) {
					const updated = [...prev];
					updated[existingIndex] = nextNotification;
					return updated;
				}
			}

			const next = [
				...prev,
				{ id: nextNotification.id || Date.now() + Math.random(), ...nextNotification },
			];

			return next.slice(-3);
		});
	};

	const closeNotification = (id) => {
		if (String(id).startsWith("message-")) {
			const matchId = String(id).replace("message-", "");
			delete messageCountsRef.current[matchId];

			if (messageTimersRef.current[matchId]) {
				clearTimeout(messageTimersRef.current[matchId]);
				delete messageTimersRef.current[matchId];
			}
		}

		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const buildSettingsNotification = () => ({
		type: "settings",
		title: "Settings updated",
	});

	const buildLanguageNotification = (languageLabel) => ({
		type: "language",
		title: `Language changed to ${languageLabel}`,
	});

	const buildMessageNotification = (matchId, name, count = 1) => ({
		id: `message-${matchId}`,
		type: "message",
		title:
			count > 1
				? `New messages from ${name} (${count})`
				: `New message from ${name}`,
	});

	const buildMatchNotification = (matchId, name) => ({
		id: `match-${matchId}`,
		type: "match",
		title: `You matched with ${name} 🎉`,
	});

	const refreshMatches = async () => {
		const data = await getAndProcessMatches();
		const safeData = data || {};

		if (didLoadMatchesRef.current) {
			Object.values(safeData).forEach((match) => {
				if (!matchesRef.current[match.matchId]) {
					const fullName = `${match?.otherUser?.firstname || ""} ${match?.otherUser?.lastname || ""}`.trim();
					showNotification(buildMatchNotification(match.matchId, fullName || "someone"));
				}
			});
		} else {
			didLoadMatchesRef.current = true;
		}

		matchesRef.current = safeData;
	};

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

				await refreshMatches();
			} catch (err) {
				console.error("loadMe failed:", err);
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				navigate("/", { replace: true });
			}
		}

		loadMe();
	}, [navigate]);

	useEffect(() => {
		if (!me?.userid) return;

		const interval = setInterval(() => {
			refreshMatches();
		}, 15000);

		const handleFocus = () => {
			refreshMatches();
		};

		window.addEventListener("focus", handleFocus);

		return () => {
			clearInterval(interval);
			window.removeEventListener("focus", handleFocus);
		};
	}, [me?.userid]);

	useEffect(() => {
		function onMessageSuccessEvent(message) {
			if (!me?.userid) return;
			if (message.fromuserid === me.userid) return;

			const currentPath = location.pathname;
			const currentChatMatchId = currentPath.startsWith("/dashboard/chat/")
				? currentPath.split("/dashboard/chat/")[1]
				: null;

			if (currentChatMatchId === message.matchid) return;

			const senderName = matchesRef.current?.[message.matchid]?.otherUser?.firstname;
			if (!senderName) return;

			const currentCount = (messageCountsRef.current[message.matchid] || 0) + 1;
			messageCountsRef.current[message.matchid] = currentCount;

			if (messageTimersRef.current[message.matchid]) {
				clearTimeout(messageTimersRef.current[message.matchid]);
			}

			messageTimersRef.current[message.matchid] = setTimeout(() => {
				delete messageCountsRef.current[message.matchid];
				delete messageTimersRef.current[message.matchid];
			}, 4500);

			showNotification(
				buildMessageNotification(message.matchid, senderName, currentCount)
			);
		}

		socket.on("messageSuccess", onMessageSuccessEvent);

		return () => {
			socket.off("messageSuccess", onMessageSuccessEvent);
		};
	}, [location.pathname, me?.userid]);

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

		if (settingsPatch?.language) {
			setLanguage(settingsPatch.language);

			const languageMap = {
				en: "English",
				fr: "French",
				sp: "Spanish",
			};

			showNotification(
				buildLanguageNotification(
					languageMap[settingsPatch.language] || settingsPatch.language
				)
			);
		} else {
			showNotification(buildSettingsNotification());
		}
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

			{notifications.map((notification, index) => (
				<NotificationModal
					key={notification.id}
					notification={notification}
					onClose={() => closeNotification(notification.id)}
					index={index}
				/>
			))}
		</div>
	);
}
