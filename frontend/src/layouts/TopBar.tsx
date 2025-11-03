import Logout from "@/components/auth/Logout";
import LanguageSelector from "@/components/LanguageSelector";
import ToggleTheme from "@/components/ToggleTheme";
import type { RootState } from "@/store/store";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const TopBar = () => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const { t } = useTranslation();

	return (
		<AppBar
			color="transparent"
			elevation={4}
			className="h-16 border-b-[0.25px] border-gray-200 bg-white/30 brightness-110 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/40"
		>
			<Toolbar className="flex justify-between p-2">
				<Typography
					variant="h1"
					className="text-sm font-medium text-black sm:text-base md:text-lg lg:text-xl dark:text-white"
				>
					{t("appName")}
				</Typography>

				<div className="flex items-center space-x-4">
					<LanguageSelector />
					<ToggleTheme />
					{isAuthenticated && <Logout />}
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
