import { useHealthCheckQuery } from "@/api/authApi";
import TopBar from "@/layouts/TopBar";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	useHealthCheckQuery();

	return (
		<div className="flex h-dvh flex-col">
			<TopBar />
			<main className="mt-16 flex-1 overflow-y-hidden">{children}</main>
		</div>
	);
};

export default Layout;
