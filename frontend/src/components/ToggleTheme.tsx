import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@mui/material";
import clsx from "clsx";
import { FC, useState } from "react";

export const ToggleTheme: FC = () => {
	const { mode, toggleTheme } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2">
			{/* Hamburger / Close Button */}
			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className={clsx(
					"flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-300 cursor-pointer",
					menuOpen ? "scale-90 bg-gray-700 dark:bg-gray-200" : "scale-100 bg-gray-200 dark:bg-gray-700",
				)}
			>
				{menuOpen ? (
					<span className="material-icons text-2xl text-black dark:text-white">close</span>
				) : (
					<span className="material-icons text-2xl text-black dark:text-white">menu</span>
				)}
			</button>

			{/* Theme Toggle Menu */}
			{menuOpen && (
				<div
					className={clsx(
						"mt-2 flex flex-col items-end space-y-2 rounded-lg p-4 shadow-xl transition-opacity duration-300",
						mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black",
					)}
				>
					<div className="flex items-center space-x-2">
						<span className="text-sm font-medium">{mode === "dark" ? "Dark Mode" : "Light Mode"}</span>
						<Switch checked={mode === "dark"} onChange={toggleTheme} color="default" />
					</div>
				</div>
			)}
		</div>
	);
};
