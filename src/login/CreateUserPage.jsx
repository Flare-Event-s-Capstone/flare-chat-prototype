import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { hasSpecialChars, hasNumber, hasUpperCase, meetsLength } from '../util/validation';
import './AppLogin.css';

function CreateUserPage() {
	const [errors, setErrors] = useState([]);
	const [message, setMessage] = useState('');
	const { token } = useParams();

	function handleCreateUser(e) {
		e.preventDefault();

		const form = new FormData(e.currentTarget);
		const email = form.get('email')?.trim() || '';
		const password = form.get('password') || '';

		let validationErrors = [];

		if (!email) {
			validationErrors.push('Please enter an email.');
		}

		if (!hasNumber(password)) {
			validationErrors.push('You must provide a password with at least one number (0-9).');
		}

		if (!hasUpperCase(password)) {
			validationErrors.push('You must provide a password with at least one uppercase character.');
		}
        
		if (!hasSpecialChars(password)) {
			validationErrors.push('You must provide a password with at least one special character.');
		}

		if (!meetsLength(password)) {
			validationErrors.push('You must provide a password with at least 8 characters.');
		}

		if (validationErrors.length > 0) {
			setErrors(validationErrors);
			setMessage('');
			return;
		}

		const requestBody = {
			email,
			password,
			firstname: 'TestFirst',
			lastname: 'TestLast'
		};

		console.log('Token:', token);
		console.log('Create user body:', requestBody);

		setErrors([]);
		setMessage('User submitted successfully.');
		e.currentTarget.reset();
	}

	return (
		<div className="login-wrapper">
			<img
				src={`${import.meta.env.BASE_URL}flare.png`}
				alt="Flare events Logo"
				className="logo"
			/>

			<h2 className="title">Create User</h2>

			<form onSubmit={handleCreateUser}>
				<label htmlFor="email">Email</label>
				<input id="email" type="text" name="email" placeholder="Enter Email" />

				<label htmlFor="password">Password</label>
				<input id="password" type="password" name="password" placeholder="Enter Password" />

				<button type="submit">Create Account</button>

				{errors.length > 0 && (
					<ul className="error">
						{errors.map((error) => (
							<li key={error}>{error}</li>
						))}
					</ul>
				)}

				{message && (
					<p className='success'>{message}</p>
				)}

				<Link to="/" className="link-button">Back to Login</Link>
			</form>
		</div>
	);
}

export default CreateUserPage;
