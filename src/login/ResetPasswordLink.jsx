import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AppLogin.css";
import { resetPasswordWithToken } from "../services/api";

export default function ResetPasswordLink() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const token = useMemo(() => (resetToken || "").trim(), [resetToken]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordWithToken(token, password);

      setSuccess("Password updated. You can now log in.");
      setTimeout(() => navigate("/", { replace: true }), 900);
    } catch (err) {
      setError(err?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <img
        src={`${import.meta.env.BASE_URL}flare.png`}
        alt="Flare events Logo"
        className="logo"
      />
      <h2 className="title">Set a new password</h2>

      <form onSubmit={onSubmit}>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Retype Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Retype new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Confirm password"}
        </button>

        {error && (
          <ul className="error">
            <li>{error}</li>
          </ul>
        )}

        {success && (
          <ul className="error" style={{ color: "#7CFC90" }}>
            <li>{success}</li>
          </ul>
        )}

        <div className="helper-row">
          <Link className="link-button" to="/">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}