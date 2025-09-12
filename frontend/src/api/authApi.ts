import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api" });

api.interceptors.request.use((config) => {
	const token = sessionStorage.getItem("token");
	if (token) {
		config.headers["Authorization"] = `Bearer ${token}`;
	}
	return config;
});

export const login = ({ email, password }: { email: string; password: string }) =>
	api
		.post("/auth/login", { email, password })
		.then((res) => {
			console.log(res);

			return {
				user: res.data.user.email,
				accessToken: res.data.accessToken,
			};
		})
		.catch((err) => {
			console.log(err);
			if (err.response.data.message) {
				throw new Error(err.response.data.message);
			}
		});

export const signup = ({
	email,
	password,
	firstName,
	lastName,
}: {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}) =>
	api
		.post("/auth/signup", { email, password, firstName, lastName })
		.then((res) => {
			console.log(res);

			return {
				user: res.data.user.email,
				accessToken: res.data.accessToken,
			};
		})
		.catch((err) => {
			console.log(err);
			if (err.response.data.message) {
				throw new Error(err.response.data.message);
			}
		});

export default api;
