import type { AuthContextType } from "@/types/contextTypes";
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const value = useMemo(() => ({ isAuthenticated, setIsAuthenticated }), [isAuthenticated]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
