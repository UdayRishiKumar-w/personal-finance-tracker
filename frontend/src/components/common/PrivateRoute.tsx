import type { RootState } from "@/store/store";
import type { FC, PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	return children ?? <Outlet />;
};

export default PrivateRoute;
