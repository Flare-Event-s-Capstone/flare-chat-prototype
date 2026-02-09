// Confirmation page for password reset

import { Link, useLocation } from 'react-router-dom'

export default function ResetSent() {
	const location = useLocation();
	const state = location?.state || {};

	const resetToken = state.resetToken ?? state.message;
	const email = state.email ?? state.username;

	const message = "If an account exists for this email, a reset link has been sent.";

	if (!email) {
		return <Navigate to="/reset" replace />;
	}

	return (
		<div className="login-wrapper">
			<img src={`${import.meta.env.BASE_URL}flare.png`} alt="Flare events Logo" className="logo" />
			<h2 className="title">Check your email!</h2>

			<ul className="error">
				<li>{message}</li>
			</ul>

			{resetToken && (
				<div className="helper-row">
					<p>Dev token for {email} :</p>
					<code style={{ fontSize: "0.5rem", wordBreak: "break-all", }}>{resetToken}</code>
				</div>
			)}

			<div className="helper-row">
				<Link className="link-button" to="/">Back to login</Link>
			</div>
		</div>
	)
}
