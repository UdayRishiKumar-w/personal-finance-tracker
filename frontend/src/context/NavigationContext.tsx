import type { FC, PropsWithChildren } from "react";
import { createContext, useLayoutEffect } from "react";
import type { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";

let navigateRef: NavigateFunction | null = null;

const NavigationContext = createContext<NavigateFunction | null>(null);

export const NavigationProvider: FC<PropsWithChildren> = ({ children }) => {
	const navigate = useNavigate();

	useLayoutEffect(() => {
		navigateRef = navigate;
		return () => {
			navigateRef = null;
		};
	}, [navigate]);

	return <NavigationContext.Provider value={navigate}>{children}</NavigationContext.Provider>;
};

export function navigateTo(path: string, options?: { replace?: boolean }) {
	if (!navigateRef) {
		console.error("navigate function not initialized yet");
		return;
	}
	navigateRef(path, options);
}
