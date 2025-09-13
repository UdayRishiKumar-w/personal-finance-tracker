import PrivateRoute from "@/components/common/PrivateRoute";
import { setCredentials } from "@/store/authSlice";
import type { RootState } from "@/store/store";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const Dashboard = lazy(async () => import("@/pages/Dashboard"));
const Login = lazy(async () => import("@/pages/Login"));
const Signup = lazy(async () => import("@/pages/Signup"));

export default function AppRouter() {
	const token = useSelector((s: RootState) => s.auth.token);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!token) {
			const sessionToken = sessionStorage.getItem("token");
			const user = sessionStorage.getItem("user");
			if (sessionToken && user) {
				dispatch(setCredentials({ token: sessionToken, user: JSON.parse(user) }));
			}
		}
	}, []);

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
