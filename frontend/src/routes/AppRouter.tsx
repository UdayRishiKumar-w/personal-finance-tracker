import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import type { RootState } from "@/store/store";
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));

export default function AppRouter() {
	const token = useSelector((s: RootState) => s.auth.token);

	return (
		<Suspense fallback={<div className="text-center p-4">Loading...</div>}>
			<Routes>
				<Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
				<Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
				<Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
				<Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
			</Routes>
		</Suspense>
	);
}

