import "./MatchesTab.css";
import { useEffect, useRef, useState } from "react";
import Popover from "./Popover";
import { getAndProcessMatches } from "../services/apiHelpers";
import { useNavigate } from "react-router-dom";

export default function MatchesTab({ open, onClose }) {
	const overlayRef = useRef(null);
	const closeBtnRef = useRef(null);
	const [matches, setMatches] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selected, setSelected] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const getMatches = async () => {
			setMatches(await getAndProcessMatches());
		};

		getMatches();
	}, []);

	useEffect(() => {
		function handleClick(e) {
			if (e.target === overlayRef.current) onClose();
		}
		if (open) {
			document.addEventListener("mousedown", handleClick);
			return () => document.removeEventListener("mousedown", handleClick);
		}
	}, [open, onClose]);

	useEffect(() => {
		if (open && closeBtnRef.current) {
			closeBtnRef.current.focus();
		}
	}, [open]);

	const openMenu = (match, el) => {
		setSelected(match);
		setAnchorEl(el);
	};

	const closeMenu = () => {
		setSelected(null);
		setAnchorEl(null);
	};

	return (
		<div
			ref={overlayRef}
			className={`matches-overlay ${open ? "show" : ""}`}
			aria-hidden={!open}
		>
			<aside
				id="matches-drawer"
				className={`matches-drawer ${open ? "open" : ""}`}
				role="dialog"
				aria-modal="true"
				aria-label="Matches"
			>
				<div className="drawer-header">
					<h2>Matches</h2>
				</div>

				<div className="drawer-body">
					{matches &&
						matches.map((data) => {
							return (<div
								key={data.matchId}
								className="match-card"
								onClick={(e) => openMenu({ id: data.matchId }, e.currentTarget)}
							>
								{data.otherUser.firstname}
							</div>)
						})
					}
				</div>
			</aside>

			{anchorEl && selected && (
				<Popover anchorEl={anchorEl} onClose={closeMenu} align="right">
					<div className="popover-menu">
						<button className="popover-item">View profile</button>
						<button className="popover-item" onClick={() => { navigate(`/chat/${selected.id}`) }}>Message</button>
						<button className="popover-item">Report</button>
						<button className="popover-item">Remove</button>
					</div>
				</Popover>
			)}
		</div>
	);
}
