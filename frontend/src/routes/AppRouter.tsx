import api from "@/api/api-config";
import Loader from "@/components/common/Loader";
import PrivateRoute from "@/components/common/PrivateRoute";
import { setAuthenticated, setLoggedOut } from "@/store/auth/authSlice";
import type { RootState } from "@/store/store";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

const Dashboard = lazy(async () => import("@/pages/Dashboard"));
const Login = lazy(async () => import("@/pages/Login"));
const Signup = lazy(async () => import("@/pages/Signup"));
const NotFound = lazy(async () => import("@/pages/NotFound"));

export default function AppRouter() {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

	useEffect(() => {
		api.get("/auth/me")
			.then(({ data }) => {
				dispatch(setAuthenticated(data.user));
			})
			.catch(() => {
				dispatch(setLoggedOut());
			})
			.finally(() => setIsLoading(false));
	}, [dispatch]);

	if (isLoading) return <Loader />;

	return (
		<Suspense fallback={<Loader />}>
			<Routes>
				<Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
				<Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
				<Route element={<PrivateRoute />}>
					<Route path="/dashboard" element={<Dashboard />}></Route>
				</Route>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}
