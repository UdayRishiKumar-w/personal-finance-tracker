import { ThemeMode } from "@/types/globalTypes";
import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type {  PropsWithChildren } from "react";
import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";

interface ThemeContextPropsType {
	mode: ThemeMode;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextPropsType>({
	mode: "light",
	toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
	const [mode, setMode] = useState<ThemeMode>("light");

	useEffect(() => {
		const localMode = localStorage.getItem("theme") as ThemeMode | null;
		if (localMode) {
			setMode(localMode);
			document.documentElement.classList.toggle("dark", localMode === "dark");
		} else {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			const preferMode = prefersDark ? "dark" : "light";
			setMode(preferMode);
			document.documentElement.classList.toggle("dark", prefersDark);
			localStorage.setItem("theme", preferMode);
		}
	}, []);

	const toggleTheme = () => {
		const newMode: ThemeMode = mode === "light" ? "dark" : "light";
		setMode(newMode);
		document.documentElement.classList.toggle("dark", newMode === "dark");
		localStorage.setItem("theme", newMode);
	};

	const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

	const muiTheme = getMuiTheme(mode);
	return (
		<ThemeContext.Provider value={value}>
			<MuiThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export const getMuiTheme = (mode: ThemeMode): Theme =>
	createTheme({
		palette: {
			mode,
			...(mode === "dark"
				? {
						background: { default: "#121212", paper: "#1e1e1e" },
						text: { primary: "#ffffff" },
					}
				: {
						background: { default: "#f5f5f5", paper: "#ffffff" },
						text: { primary: "#000000" },
					}),
		},
	});
