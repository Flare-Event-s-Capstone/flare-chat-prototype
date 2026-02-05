// Password reset page
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestPasswordReset } from '../services/api'

export default function ResetPassword() {
	const [errors, setErrors] = useState([])
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	async function onSubmit(e) {
		e.preventDefault()
		setErrors([])
		setLoading(true)

		const email = e.target.email.value.trim()

		try {
			const res = await requestPasswordReset(email)
			navigate('/reset/sent', {
				state: {
					message: res.resetToken,
					email: email
				}
			})
		}
		catch (err) {
			setErrors([err.message || 'Something went wrong'])
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<div className="login-wrapper">
			<img src={`${import.meta.env.BASE_URL}flare.png`} alt="Flare events Logo" className="logo" />
			<h2 className="title">Reset Password</h2>

			<form onSubmit={onSubmit}>
				<label htmlFor="email">Email</label>
				<input id="email" name="email" type="text" placeholder="Enter Email" />

				<button type="submit" disabled={loading}>
					{loading ? 'Sending…' : 'Send reset link'}
				</button>

				{errors.length > 0 && (
					<ul className="error">
						{errors.map((e) => <li key={e}>{e}</li>)}
					</ul>
				)}
			</form>

			<div className="helper-row">
				<Link className="link-button" to="/">Back to login</Link>
			</div>
		</div>
	)
}
