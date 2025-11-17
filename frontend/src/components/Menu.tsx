import ToggleTheme from "@/components/ToggleTheme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import clsx from "clsx";
import type { FC } from "react";
import { useState } from "react";

export const Menu: FC = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<Box className="fixed top-7.5 right-2 z-50 flex flex-col items-end space-y-2">
			<Button
				onClick={() => {
					setMenuOpen(!menuOpen);
				}}
				className={clsx(
					"flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform duration-300 dark:shadow-white",
					menuOpen ? "scale-90 bg-gray-700 dark:bg-gray-200" : "scale-100 bg-gray-200 dark:bg-gray-700",
				)}
			>
				{menuOpen ? (
					<span className="material-icons text-2xl text-black dark:text-white">close</span>
				) : (
					<span className="material-icons text-2xl text-black dark:text-white">menu</span>
				)}
			</Button>

			{menuOpen && <ToggleTheme />}
		</Box>
	);
};
