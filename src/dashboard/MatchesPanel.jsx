import { useEffect, useState } from "react";
import "./Panel.css";
import { getAndProcessMatches } from "../services/apiHelpers";
import { useNavigate } from "react-router-dom";
import { t } from "../util/i18n";
import PopupModal from "./PopupModal";
import { leaveChat, reportChat } from "../services/api";

export default function MatchesPanel() {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [clickedChat, setClickedChat] = useState();
	const navigate = useNavigate();

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
									onClick={() => navigate(`/chat/${m.matchId}`)}
									type="button"
								>
									{t("message")}
								</button>

								<button className="panel-btn secondary" type="button" disabled>
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
		</div>
	);
}
