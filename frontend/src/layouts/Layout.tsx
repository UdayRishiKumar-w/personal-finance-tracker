import { useHealthCheckQuery } from "@/api/authApi";
import NavBar from "@/layouts/NavBar";
import Box from "@mui/material/Box";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	useHealthCheckQuery();

	return (
		<Box className="flex h-dvh flex-col overflow-hidden bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
			<NavBar />
			<main className="relative h-full flex-1 overflow-auto">{children}</main>
		</Box>
	);
};

export default Layout;
