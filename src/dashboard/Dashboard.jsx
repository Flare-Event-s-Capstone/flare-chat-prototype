import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import MatchesTab from "./MatchesTab";
import SettingsTab from "./SettingsTab";
import { getMe } from "../services/api";

export default function Dashboard() {
	const [open, setOpen] = useState(false);
	const [openSettings, setOpenSettings] = useState(false);

	const [me, setMe] = useState(null);
	const [loadingMe, setLoadingMe] = useState(true);

	const navigate = useNavigate();

	useEffect(() => {
		async function loadMe() {
			try {
				const token = localStorage.getItem("accessToken");
				if (!token) {
					navigate("/", { replace: true });
					return;
				}

				const user = await getMe();
				setMe(user);
			} catch (err) {
				// token invalid/expired or request failed
				navigate("/", { replace: true });
			} finally {
				setLoadingMe(false);
			}
		}

		loadMe();
	}, [navigate]);

	return (
		<div className="dashboard">

			{!open && !openSettings && (
				<>
					<h2 className="matches-link" onClick={() => setOpen(true)}>
						Matches
					</h2>

					<h2 className="settings-link" onClick={() => setOpenSettings(true)}>
						Settings
					</h2>
				</>
			)}

			{/* Tabs */}
			<MatchesTab open={open} onClose={() => setOpen(false)} />
			<SettingsTab open={openSettings} onClose={() => setOpenSettings(false)} />
		</div>
	);
}
