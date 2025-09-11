import type { RootState } from "@/store/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
	const token = useSelector((state: RootState) => state.auth.token);

	return token ? children : <Navigate to="/login" replace />;
}
