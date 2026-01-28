const API_URL = import.meta.env.VITE_API_URL;

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/api/v1/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/api/v1/me/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.message || body.type || "Invalid email or password");
  }

  return body; // accessToken, refreshToken, etc
}

export async function requestPasswordReset(email) {
  const res = await fetch(`${API_URL}/api/v1/credentials/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to request password reset");
  }

  const data = await res.json(); // resetToken
  return {
    message: "If an account exists, a reset link was sent.",
    resetToken: data.resetToken,
  };
}