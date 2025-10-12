import { useAuth } from "@/context/AuthContext";
import { clearCredentials } from "@/store/auth/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import type { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout: FC = () => {
	const { setIsAuthenticated } = useAuth();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		dispatch(clearCredentials());
		setIsAuthenticated(false);
		navigate("/login", { replace: true });
	};

	return (
		<IconButton color="inherit" onClick={handleLogout} title="Logout">
			<LogoutIcon className="text-red-600" />
		</IconButton>
	);
};

export default Logout;
