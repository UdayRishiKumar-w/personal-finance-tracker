import Constants from "@/Constants";
import { setLoggedOut } from "@/store/auth/authSlice";
import { store } from "@/store/store";
import type { CustomAxiosRequestConfig } from "@/types/apiTypes";
import type { AxiosError, AxiosResponse } from "axios";
import axios, { HttpStatusCode } from "axios";

// const baseURL = import.meta.env.PROD ? "/api" : import.meta.env.VITE_API_BASE || "http://localhost:8080/api"; //nginx as proxy use
const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
	timeout: 30_000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
});

export const healthApi = axios.create({
	baseURL: (import.meta.env.VITE_API_BASE || "http://localhost:8080/api").replace("/api", "/actuator/health"),
	timeout: 60_000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// api.interceptors.request.use((config) => {
// 	const token = sessionStorage.getItem("token");
// 	if (token) {
// 		config.headers["Authorization"] = `Bearer ${token}`;
// 	}
// 	return config;
// });

let isRefreshing = false;
let failedQueue: Array<(tokenRefreshed: boolean) => void> = [];

const processQueue = (success: boolean) => {
	failedQueue.forEach((cb) => cb(success));
	failedQueue = [];
};

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		if (originalRequest?.url?.includes("/auth/") && !originalRequest.url.includes("/auth/me")) {
			return Promise.reject(error);
		}

		if (error.response?.status === HttpStatusCode.Unauthorized && originalRequest && !originalRequest._retry) {
			if (isRefreshing) {
				// Wait until refresh completes
				return new Promise((resolve, reject) => {
					failedQueue.push((success) => {
						if (success) {
							resolve(api(originalRequest));
						} else {
							reject(error);
						}
					});
				});
			}

			originalRequest._retry = true; // To avoid infinite retries
			isRefreshing = true;

			try {
				await api.post("/auth/refresh");
				processQueue(true);
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(false);
				store.dispatch(setLoggedOut());
				return Promise.reject(refreshError as Error);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default api;

export const throwError = (err: Error) => {
	if (import.meta.env.DEV) {
		console.log(err);
		throw new Error(err.message);
	} else {
		throw new Error(Constants.errorMessage);
	}
};

export const queryFn = async <T>(url: string): Promise<T> => {
	const { data } = await api.get<T>(url);
	return data;
};
