import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { clearCredentials } from "@/store/authSlice";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { mode, toggleTheme } = useTheme();
	const { isAuthenticated, setIsAuthenticated } = useAuth();
	const [language, setLanguage] = useState("en");

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		dispatch(clearCredentials());
		setIsAuthenticated(false);
		navigate("/login", { replace: true });
	};

	return (
		<AppBar
			color="transparent"
			elevation={4}
			className="h-16 border-b-[0.25px] border-gray-200 bg-white/30 brightness-110 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/40"
		>
			<Toolbar className="flex justify-between p-2">
				<Typography
					variant="h6"
					className="text-sm text-black sm:text-base md:text-lg lg:text-xl dark:text-white"
				>
					Personal Finance Tracker
				</Typography>

				<div className="flex items-center space-x-4">
					<Select
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
						variant="standard"
						className="w-20 text-black dark:text-white [&>svg]:text-black dark:[&>svg]:text-white"
						disableUnderline
					>
						<MenuItem value="en">EN</MenuItem>
						<MenuItem value="fr">FR</MenuItem>
						<MenuItem value="es">ES</MenuItem>
					</Select>

					<IconButton onClick={toggleTheme} color="inherit">
						{mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
					</IconButton>

					{isAuthenticated && (
						<IconButton color="inherit" onClick={handleLogout} title="Logout">
							<span className="material-icons text-red-600">logout</span>
						</IconButton>
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
