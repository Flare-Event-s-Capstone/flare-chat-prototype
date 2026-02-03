import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function ProfileModal({ open, onClose }) {
	const [name, setName] = useState("Leo Tran");
	const [bio, setBio] = useState("Tell others a bit about yourself...");
	const [city, setCity] = useState("Toronto");
	const [province, setProvince] = useState("ON");

	const [email, setEmail] = useState("");

	useEffect(() => {
		if (!open) return;

		(async () => {
			try {
				const me = await getMe();
				setEmail(me?.email || "");
			} catch {
				setEmail("");
			}
		})();
	}, [open]);

	const handleSave = (e) => {
		e.preventDefault();
		// TODO: connect to backend/profile context later
		console.log({ name, bio, city, province });
		onClose();
	};

	const initials = name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<Modal open={open} onClose={onClose} title="Profile">
			<form className="modal-form" onSubmit={handleSave}>
				{/* Avatar */}
				<div className="profile-avatar-row">
					<div className="profile-avatar-placeholder">
						<span>{initials}</span>
					</div>
				</div>

				{/* Name */}
				<div className="modal-field">
					<label className="modal-label">Name</label>
					<input
						type="text"
						className="modal-input"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Your name"
					/>
				</div>

				
        {/* Email (read-only) */}
        <div className="modal-field">
          <label className="modal-label">Email</label>
          <input
            type="text"
            className="modal-input"
            value={email || "—"}
            disabled
            readOnly
          />
        </div>

				{/* Bio */}
				<div className="modal-field">
					<label className="modal-label">Bio</label>
					<textarea
						className="modal-textarea"
						rows={3}
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						placeholder="Tell others a bit about yourself..."
					/>
				</div>

				{/* Location */}
				<div className="modal-field modal-field-row">
					<div className="modal-field-half">
						<label className="modal-label">City</label>
						<input
							type="text"
							className="modal-input"
							value={city}
							onChange={(e) => setCity(e.target.value)}
							placeholder="City"
						/>
					</div>
					<div className="modal-field-half">
						<label className="modal-label">Province</label>
						<input
							type="text"
							className="modal-input"
							value={province}
							onChange={(e) => setProvince(e.target.value)}
							placeholder="Province"
						/>
					</div>
				</div>

				<div className="modal-footer">
					<button
						type="button"
						className="modal-button secondary"
						onClick={onClose}
					>
						Cancel
					</button>
					<button type="submit" className="modal-button primary">
						Save
					</button>
				</div>
			</form>
		</Modal>
	);
}
