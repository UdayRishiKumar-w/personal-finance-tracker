import Logout from "@/components/auth/Logout";
import LanguageSelector from "@/components/LanguageSelector";
import ToggleTheme from "@/components/ToggleTheme";
import type { RootState } from "@/store/store";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const { t } = useTranslation();
	const location = useLocation();

	return (
		<AppBar
			position="sticky"
			color="transparent"
			elevation={4}
			className="border-b-[0.25px] border-gray-200 bg-white/30 shadow-sm brightness-110 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/40"
		>
			<Toolbar className="flex justify-between p-2">
				<Typography
					variant="h1"
					className="text-sm font-medium text-black sm:text-base md:text-lg lg:text-xl dark:text-white"
				>
					{t("appName")}
				</Typography>

				<div className="flex items-center gap-2">
					{isAuthenticated && (
						<>
							<Button
								component={Link}
								to="/dashboard"
								variant={location.pathname === "/dashboard" ? "contained" : "text"}
								color="primary"
							>
								Dashboard
							</Button>
							<Button
								component={Link}
								to="/transactions"
								variant={location.pathname === "/transactions" ? "contained" : "text"}
								color="primary"
							>
								Transactions
							</Button>
						</>
					)}
					<LanguageSelector />
					<ToggleTheme />
					{isAuthenticated && <Logout />}
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;
