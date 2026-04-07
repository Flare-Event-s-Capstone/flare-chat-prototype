import { socket } from "./ws";
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
	baseURL: `${API_URL}/api/v1`,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Handle authentication for requests if we have an accessToken
axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
)

let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (token) => {
	failedRequestsQueue.forEach(p => p.resolve(token));
	failedRequestsQueue = [];
}

const handleTokenRefreshFailure = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	window.location.replace("/");
}

// Handle token refreshing
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status == 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise(function (resolve, reject) {
					failedRequestsQueue.push({ resolve, reject });
				}).then(token => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return axiosInstance(originalRequest);
				}).catch(err => {
					return Promise.reject(err);
				})
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const accessToken = localStorage.getItem('accessToken');
				const refreshToken = localStorage.getItem('refreshToken');
				const response = await axios.get(`${API_URL}/api/v1/me/sessions/refresh`, { headers: { Authorization: accessToken, "x-refresh": refreshToken } });
				const newAccessToken = response.data.accessToken;
				const newRefreshToken = response.data.refreshToken;

				localStorage.setItem('accessToken', newAccessToken);
				if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

				isRefreshing = false;
				processQueue(newAccessToken);

				if (!socket.connected) socket.connect();

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;
				handleTokenRefreshFailure();
				console.log(refreshError);
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
)

export async function registerUser(data, token) {
	const url = token
		? `${API_URL}/api/v1/users?token=${encodeURIComponent(token)}`
		: `${API_URL}/api/v1/users`;

	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	let result = {};

	try {
		result = await res.json();
	} catch {
		result = {};
	}

	if (!res.ok) {
		throw new Error(
			result?.issues?.[0]?.message ||
			result?.message ||
			result?.type ||
			"Failed to create user."
		);
	}

	return result;
}

export async function loginUser(data) {
	try {
		const response = await axios.post(`${API_URL}/api/v1/me/sessions`, data, { headers: { "Content-Type": "application/json" } });
		if (response.data.accessToken) localStorage.setItem('accessToken', response.data.accessToken);
		if (response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);

		if (!socket.connected) socket.connect();

		return response.data;
	} catch (error) {
		if (error.response?.status == 401) {
			throw new Error("Invalid email or password");
		}
		throw new Error(
			error.response?.data?.message ||
			error.response?.data?.type ||
			"Login failed"
		);
	}
}

export async function logoutUser() {
	try {
		await axiosInstance.delete('/me/sessions');
		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		sessionStorage.clear();
	} catch (error) {}
}

export async function requestPasswordReset(email) {
	try {
		const response = await axiosInstance.post('/credentials/reset', { email: email });
		return {
			message: "If an account exists, a reset link was sent.",
			resetToken: response.data.resetToken
		}
	} catch (error) {
		return {};
	}
}

export async function getMe() {
	try {
		const response = await axiosInstance.get('/me')
		sessionStorage.setItem('userid', response.data.userid);
		return response.data;
	} catch (error) {
		return {};
	}
}

export async function getUser(userId) {
	try {
		const response = await axiosInstance.get(`/users/${userId}`);
		return response.data;
	} catch (error) {
		return {};
	}
}

export async function getMatches() {
	try {
		const response = await axiosInstance.get('/me/matches');
		return response.data;
	} catch (error) {
		return [];
	}
}

export async function getMessages(matchid, offset) {
	try {
		const response = await axiosInstance.get(`/me/messages/${matchid}?offset=${offset}`);
		return response.data;
	} catch (error) {
		return [];
	}
}

export async function sendMessage(matchid, message) {
	try {
		await axiosInstance.post(`/me/messages/${matchid}/send`, { content: message });
	} catch (error) {}
}

export async function updateMySettings(settingsPatch) {
	try {
		const response = await axiosInstance.patch('/me/settings', settingsPatch);
		return response.data;
	} catch (error) {
		return {};
	}
}

export async function leaveChat(matchid) {
	try {
		await axiosInstance.delete(`/me/matches/${matchid}`)
	} catch (error) {}
}

export async function reportChat(matchid) {
	try {
		await axiosInstance.get(`/me/matches/${matchid}/report`)
	} catch (error) {}
}

export async function resetPasswordWithToken(resetToken, password) {
	try {
		const res = await axios.patch(`${API_URL}/api/v1/credentials/reset/${resetToken}`, JSON.stringify({ password }), { headers: { "Content-Type": "application/json" } });
		return res.data;
	} catch (error) {
		const message =
			error.data?.issues?.[0]?.message ||
			error.data?.message ||
			error.data?.type ||
			"Failed to reset password";

		throw new Error(message);
	}
}
