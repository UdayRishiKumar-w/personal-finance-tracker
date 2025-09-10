import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api" });

export const login = (email: string, password: string) =>
	api.post("/auth/signup", { email, password }).then((res) => {
		console.log(res);

		return {
			user: res.data.user.email,
			accessToken: res.data.accessToken,
		};
	});

export default api;
