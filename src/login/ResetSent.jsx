// Confirmation page for password reset

import { Link, useLocation, Navigate } from 'react-router-dom'

export default function ResetSent() {
	const location = useLocation();
	const state = location?.state || {};

	const resetToken = state.resetToken ?? state.message;
	const email = state.email ?? state.username;

	const message = "If an account exists for this email, a reset link has been sent.";

	if (!email) {
		return <Navigate to="/reset" replace />;
	}

	const resetUrl = resetToken
		? `${window.location.origin}${import.meta.env.BASE_URL}reset/${resetToken}`
		: "";

	const handleCopy = async () => {
		if (!resetUrl) return;
		try {
			await navigator.clipboard.writeText(resetUrl);
		} catch (e) {
			console.warn("Clipboard copy failed:", e);
		}
	};

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
					<code style={{ fontSize: "0.5rem", wordBreak: "break-all" }}>{resetToken}</code>
				</div>
			)}

			{resetToken && (
				<div className="helper-row">
					<button type="button" onClick={handleCopy}>
						Copy reset link
					</button>
				</div>
			)}

			<div className="helper-row">
				<Link className="link-button" to="/">Back to login</Link>
			</div>
		</div>
	)
}