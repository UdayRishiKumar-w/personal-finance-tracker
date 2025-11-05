import { useHealthCheckQuery } from "@/api/authApi";
import NavBar from "@/layouts/NavBar";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	useHealthCheckQuery();

	return (
		<div className="flex h-dvh flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
			<NavBar />
			<main className="flex-1">{children}</main>
		</div>
	);
};

export default Layout;
