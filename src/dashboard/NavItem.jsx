import { useMatch, useNavigate } from "react-router-dom";
import "./NavItem.css";

export default function NavItem({label, to}) {
	const match = useMatch(to);
	const navigate = useNavigate();

	return (<button
		className={`sidebar-item ${match ? "active" : ""}`}
		onClick={() => navigate(to)}
		type="button"
	>
		{label}
	</button>);
}
