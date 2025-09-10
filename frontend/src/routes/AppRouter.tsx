import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import type { RootState } from "../app/store";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";

export default function AppRouter() {
	const token = useSelector((s: RootState) => s.auth.token);

	useEffect(() => {
		console.log("Token in AppRouter:", token);
	}, [token]);

	return (
		<Routes>
			<Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
			<Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
			<Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
		</Routes>
	);
}
