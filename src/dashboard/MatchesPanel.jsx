import { useEffect, useState } from "react";
import "./Panel.css";
import { getAndProcessMatches } from "../services/apiHelpers";
import { useNavigate, useOutletContext } from "react-router-dom";
import { t } from "../util/i18n";
import PopupModal from "./PopupModal";
import { leaveChat, reportChat } from "../services/api";

export default function MatchesPanel() {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [profileModalIsOpen, setProfileModalIsOpen] = useState(false);
	const [clickedChat, setClickedChat] = useState();
	const [selectedProfile, setSelectedProfile] = useState(null);
	const navigate = useNavigate();
	const {me, setMobileTitle} = useOutletContext();

	useEffect(() => {
		setMobileTitle(t("matches"));
	}, []);

	const populateMatches = async () => {
		try {
			const data = await getAndProcessMatches();
			setMatches(Object.values(data));
		} catch (e) {
			setMatches([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		populateMatches();
	}, []);

	return (
		<div className="panel">
			<div className="panel-header">
				<h2>{t("matches")}</h2>
			</div>

			<div className="panel-grid">
				{loading && <div className="panel-empty">{t("loading")}</div>}

				{!loading &&
					matches.map((m, index) => (
						<div key={index} className="panel-card">
							<div className="panel-card-title">
								{m?.otherUser?.firstname} {m?.otherUser?.lastname}
							</div>

							<div className="panel-card-actions">
								<button
									className="panel-btn"
									onClick={() => navigate(`/dashboard/chat/${m.matchId}`)}
									type="button"
								>
									{t("message")}
								</button>

								<button
									className="panel-btn secondary"
									type="button"
									onClick={() => {
										setSelectedProfile(m?.otherUser);
										setProfileModalIsOpen(true);
									}}
								>
									{t("viewProfile")}
								</button>

								<button className="panel-btn danger" type="button" onClick={() => { setModalIsOpen(true); setClickedChat(m.matchId) }}>
									{t("leaveChat")}
								</button>
							</div>
						</div>
					))}

				{!loading && matches.length === 0 && (
					<div className="panel-empty">{t("noMatches")}</div>
				)}
			</div>

			{modalIsOpen &&
				<PopupModal onClose={() => setModalIsOpen(false)}>
					<h2 className="popupmodal-header">{t("reportQuestion")}</h2>
					<div className="popupmodal-buttons">
						<button className="modal-button" onClick={async () => { setModalIsOpen(false); await reportChat(clickedChat); populateMatches(); }} >{t("reportAndLeave")}</button>
						<button className="modal-button" onClick={async () => { setModalIsOpen(false); await leaveChat(clickedChat); populateMatches(); }} >{t("leave")}</button>
					</div>
				</PopupModal>
			}

			{profileModalIsOpen && selectedProfile &&
				<PopupModal onClose={() => setProfileModalIsOpen(false)}>
					<div className="profile-modal-banner" />
					<div className="profile-modal-avatar">
						{`${selectedProfile?.firstname?.[0] || ""}${selectedProfile?.lastname?.[0] || ""}`.toUpperCase() || "U"}
					</div>

					<div className="profile-modal-body">
						<h2 className="profile-modal-name">
							{selectedProfile?.firstname} {selectedProfile?.lastname}
						</h2>

						<div className="profile-modal-section">
							<div className="profile-modal-label">Bio</div>
							<div className="profile-modal-value">—</div>
						</div>

						<div className="profile-modal-section">
							<div className="profile-modal-label">Location</div>
							<div className="profile-modal-value">—</div>
						</div>

						<div className="profile-modal-section">
							<div className="profile-modal-label">Interests</div>
							<div className="profile-modal-value">—</div>
						</div>

						<div className="profile-modal-section">
							<div className="profile-modal-label">Looking For</div>
							<div className="profile-modal-value">—</div>
						</div>
					</div>
				</PopupModal>
			}
		</div>
	);
}