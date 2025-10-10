import { useTheme } from "@/context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import type { FC } from "react";

const ToggleTheme: FC = () => {
	const { mode, toggleTheme } = useTheme();
	return (
		<IconButton onClick={toggleTheme} color="inherit">
			{mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
		</IconButton>
	);
};

export default ToggleTheme;
