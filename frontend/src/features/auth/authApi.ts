import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api" });

export const login = (email: string, password: string) =>
	api.post("/auth/login", { email, password }).then((res) => res.data);

export default api;
