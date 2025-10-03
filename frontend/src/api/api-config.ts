import Constants from "@/Constants";
import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
	timeout: 30_000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const token = sessionStorage.getItem("token");
	if (token) {
		config.headers["Authorization"] = `Bearer ${token}`;
	}
	return config;
});

export default api;

export const throwError = (err: Error) => {
	if (import.meta.env.DEV) {
		console.log(err);
		throw new Error(err.message);
	} else {
		throw new Error(Constants.errorMessage);
	}
};
