import type { ThemeMode } from "@/types/globalTypes";
import CssBaseline from "@mui/material/CssBaseline";
import type { Theme } from "@mui/material/styles";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
			const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
			const preferMode = prefersDarkMode ? "dark" : "light";
			setMode(preferMode);
			document.documentElement.classList.toggle("dark", prefersDarkMode);
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
		// // https://mui.com/material-ui/customization/css-theme-variables/configuration/#toggling-dark-mode-manually
		// // https://mui.com/material-ui/customization/palette/#color-schemes
		// colorSchemes: { light: true, dark: true },
		// cssVariables: {
		// 	colorSchemeSelector: "class",
		// },
		palette: {
			mode,
			...(mode === "dark"
				? {
						background: { default: "#121212", paper: "#1e1e1e" },
						text: { primary: "#fff" },
					}
				: {
						background: { default: "#f5f5f5", paper: "#fff" },
						text: { primary: "#000" },
					}),
		},
	});
