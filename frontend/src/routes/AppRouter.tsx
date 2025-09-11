import PrivateRoute from "@/components/common/PrivateRoute";
import type { RootState } from "@/store/store";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));

export default function AppRouter() {
	const token = useSelector((s: RootState) => s.auth.token);

	return (
		<Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
			<Routes>
				<Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" replace />} />
				<Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
				<Route
					path="/dashboard"
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</Suspense>
	);
}
