import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@mui/material";
import clsx from "clsx/lite";
import type { FC } from "react";

const ToggleTheme: FC = () => {
	const { mode, toggleTheme } = useTheme();
	return (
		<div
			className={clsx(
				"mt-2 flex flex-col items-end space-y-2 rounded-lg p-4 shadow-xl transition-opacity duration-300 dark:shadow-white",
				mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black",
			)}
		>
			<div className="flex items-center space-x-2">
				<span className="text-sm font-medium">{mode === "dark" ? "Dark Mode" : "Light Mode"}</span>
				<Switch checked={mode === "dark"} onChange={toggleTheme} color="default" />
			</div>
		</div>
	);
};

export default ToggleTheme;
