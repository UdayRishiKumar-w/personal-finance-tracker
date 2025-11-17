import Logout from "@/components/auth/Logout";
import LanguageSelector from "@/components/LanguageSelector";
import ToggleTheme from "@/components/ToggleTheme";
import type { RootState } from "@/store/store";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const { t } = useTranslation();
	const location = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen((prev) => !prev);
	};

	const navItems = [
		{ label: "Dashboard", to: "/dashboard" },
		{ label: "Transactions", to: "/transactions" },
	];

	return (
		<AppBar
			position="sticky"
			color="transparent"
			elevation={4}
			className="top-0 z-50 border-b border-white/10 bg-white/30 shadow-sm brightness-110 backdrop-blur-lg transition-all duration-300 ease-in-out dark:border-gray-700/60 dark:bg-gray-900/30"
		>
			<Toolbar className="flex justify-between p-2 md:px-4">
				<Typography
					variant="h1"
					className="text-base font-semibold text-black sm:text-lg md:text-xl dark:text-white"
				>
					{t("appName")}
				</Typography>

				<Box className="hidden items-center gap-3 md:flex">
					{isAuthenticated &&
						navItems.map(({ label, to }) => (
							<Button
								key={to}
								component={NavLink}
								to={to}
								end
								color="primary"
								size="small"
								className={clsx({ "rounded-md shadow-md": location.pathname === to })}
								variant="text"
								sx={({ palette }) => ({
									"&.active": {
										backgroundColor: palette.primary.main,
										color: palette.primary.contrastText,
									},
								})}
							>
								{label}
							</Button>
						))}

					<LanguageSelector />
					<ToggleTheme />
					{isAuthenticated && <Logout />}
				</Box>

				<Box className="flex items-center md:hidden">
					<IconButton
						onClick={toggleMenu}
						color="inherit"
						size="small"
						aria-label="toggle menu"
						aria-expanded={menuOpen}
					>
						{menuOpen ? <CloseIcon /> : <MenuIcon />}
					</IconButton>
				</Box>
			</Toolbar>

			<Collapse in={menuOpen} timeout="auto" unmountOnExit>
				<Box className="flex flex-col items-end gap-3 bg-white/90 p-4 shadow-md backdrop-blur-md transition-all duration-300 md:hidden dark:bg-gray-900/90">
					{isAuthenticated &&
						navItems.map(({ label, to }) => (
							<Button
								key={to}
								component={NavLink}
								to={to}
								end
								onClick={() => {
									setMenuOpen(false);
								}}
								className={clsx(
									"w-full justify-end rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:shadow-md active:scale-[0.98]",
									location.pathname === to
										? "bg-blue-500/90 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20"
										: "text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
								)}
							>
								{label}
							</Button>
						))}

					<LanguageSelector />

					<Box className="flex w-full justify-end gap-3">
						<ToggleTheme />
						{isAuthenticated && <Logout />}
					</Box>
				</Box>
			</Collapse>
		</AppBar>
	);
};

export default NavBar;
