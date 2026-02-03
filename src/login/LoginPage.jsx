import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { hasSpecialChars, hasNumber, hasUpperCase, meetsLength } from '../util/validation';
import './AppLogin.css'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { loginUser } from '../services/api';

function LoginPage() {
	function signupAction(prevFormState, formData) {
		const email = formData.get('email');
		const password = formData.get('password');

		let errors = [];

		if (!hasNumber(password)) {
			errors.push('You must provide a password with at least one number (0-9).')
		}

		if (!hasUpperCase(password)) {
			errors.push('You must provide a password with at least one uppercase character.')
		}

		if (!hasSpecialChars(password)) {
			errors.push('You must provide a password with at least (for now) one special character.')
		}

		if (!meetsLength(password)) {
			errors.push('You must provide a password with at least 8 characters.')
		}

		if (errors.length > 0) {
			return { errors };
		}

		return { errors: null }
	}

	const [formState, formAction, pending] = useActionState(signupAction, { errors: null });

	// Forgot Password Section
	const [showReset, setShowReset] = useState(false);
	const [resetMessage, setResetMessage] = useState('');

	function passwordReset(e) {
		e.preventDefault();

		const email = e.target.email.value.trim();

		if (email.length < 3) {
			setResetMessage("Enter a valid email.");
			return;
		}

		setResetMessage("An email with a reset form has been sent to the corresponding user (If it exists).")
		e.target.reset();
	}

	const [loginError, setLoginError] = useState('');

	const navigate = useNavigate();

	async function handleLogin(e) {
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const email = form.get("email")?.trim();
		const password = form.get("password") ?? "";

		try {
			// Call API
			const session = await loginUser({ email, password });

			// Demo / verification logs
			console.log("Login response:", session);
			console.log("Stored accessToken:", localStorage.getItem("accessToken"));
			console.log("Stored refreshToken:", localStorage.getItem("refreshToken"));

			setLoginError("");

			// Go to dashboard
			navigate("/dashboard");
		} catch (err) {
			setLoginError(err.message || "Invalid email or password.");
		}
	}

	useEffect(() => {
		if (localStorage.getItem("accessToken")) {
			navigate("/dashboard", { replace: true });
		}
	})

	return (
		<>
			<div className="login-wrapper">
				<img src={`${import.meta.env.BASE_URL}flare.png`} alt="Flare events Logo" className="logo" />
				<h2 className="title">Member Login</h2>
				<form onSubmit={handleLogin}>
					<label htmlFor="email">Email</label>
					<input id="email" type="text" name="email" placeholder="Enter Email" />

					<label htmlFor="password">Password</label>
					<input id="password" type="password" name="password" placeholder="Enter Password" />

					<button style={{ marginTop: "3vh" }} type="submit">Login</button>

					{formState.errors && <ul className='error'>
						{formState.errors.map((error) => (
							<li key={error}>{error}</li>
						))}

						{loginError && (
							<ul className="error">
								<li>{loginError}</li>
							</ul>
						)}

					<p id="message"></p>
					</ul>}

					<Link to="/reset" className="link-button">Forgot Password?</Link>
				</form>

				{showReset && (
					<form className="reset-box" onSubmit={passwordReset}>
						<h3 className="title">Reset Password</h3>

						<label htmlFor="reset-email">Email</label>
						<input id="reset-email" name="email" type="text" placeholder="Enter your Email" />

						<button type="submit">Send reset link</button>

						{resetMessage && (
							<ul className="error">
								<li>{resetMessage}</li>
							</ul>
						)}

						<Link to="/" className="link-button">Back to login</Link>


					</form>
				)}

			</div>


		</>
	)
}

export default LoginPage
