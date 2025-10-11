import TopBar from "@/components/TopBar";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex h-screen flex-col">
			<TopBar />
			<main className="mt-16 flex-1 overflow-y-auto">{children}</main>
		</div>
	);
};

export default Layout;
