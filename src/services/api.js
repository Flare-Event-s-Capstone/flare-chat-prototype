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
	// Store tokens for demo + future auth
	// (Names may differ depending on backend response)
	if (body.accessToken) localStorage.setItem("accessToken", body.accessToken);
	if (body.refreshToken) localStorage.setItem("refreshToken", body.refreshToken);

	return body;
}

export async function logoutUser() {
	const token = localStorage.getItem("accessToken");

	// If we don't have a token, nothing to invalidate server-side
	if (!token) return;

	const res = await fetch(`${API_URL}/api/v1/me/sessions`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	localStorage.removeItem("accessToken");
	localStorage.removeItem("accessToken");
	sessionStorage.clear();

	// optional: if you want to surface an error
	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body.message || "Logout failed");
	}
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

async function reauth(callback) {
	const accessToken = localStorage.getItem("accessToken");
	const refreshToken = localStorage.getItem("refreshToken");

	if (!refreshToken) {
		throw new Error("Could not get refreshToken!");
	}

	let res;

	try {
		res = await fetch(`${API_URL}/api/v1/me/sessions/refresh`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"x-refresh": refreshToken
			}
		});
	} catch (e) {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	}

	if (!res.ok) {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	}

	const body = await res.json();

	if (body.accessToken) localStorage.setItem("accessToken", body.accessToken);
	if (body.refreshToken) localStorage.setItem("refreshToken", body.refreshToken);

	return callback();
}

export async function getMe() {
	const token = localStorage.getItem("accessToken");

	const res = await fetch(`${API_URL}/api/v1/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 401)
		return reauth(getMe)
	else if (!res.ok)
		throw new Error(res);

	const body = await res.json();

	sessionStorage.setItem("userid", body.userid);

	return body;
}

export async function getUser(userId) {
	const token = localStorage.getItem("accessToken");

	const res = await fetch(`${API_URL}/api/v1/users/${userId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 401)
		return reauth(getUser)
	else if (!res.ok)
		throw new Error(res);

	return res.json();
}

export async function getMatches() {
	const token = localStorage.getItem("accessToken");

	const res = await fetch(`${API_URL}/api/v1/me/matches`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 401)
		return reauth(getMatches)
	else if (!res.ok)
		throw new Error(res);

	return res.json();
}

export async function getMessages(matchid, offset) {
	const token = localStorage.getItem("accessToken");

	const res = await fetch(`${API_URL}/api/v1/me/messages/${matchid}?offset=${offset}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 401)
		return reauth(getMatches)
	else if (!res.ok)
		throw new Error(res);

	return res.json();
}

export async function sendMessage(matchid, message) {
	const token = localStorage.getItem("accessToken");

	const res = await fetch(`${API_URL}/api/v1/me/messages/${matchid}/send`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({ content: message })
	});

	if (res.status === 401)
		return reauth(getMatches)
	else if (!res.ok)
		throw new Error(res);
}
