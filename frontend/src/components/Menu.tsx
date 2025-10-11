import ToggleTheme from "@/components/ToggleTheme";
import clsx from "clsx/lite";
import type { FC } from "react";
import { useState } from "react";

export const Menu: FC = () => {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="top-7.5 fixed right-2 z-50 flex flex-col items-end space-y-2">
			<button
				onClick={() => setMenuOpen(!menuOpen)}
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
			</button>

			{menuOpen && <ToggleTheme />}
		</div>
	);
};
