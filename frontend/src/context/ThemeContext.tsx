import type { ThemeMode } from "@/types/globalTypes";
import CssBaseline from "@mui/material/CssBaseline";
import { arSA, deDE, enUS, jaJP, ruRU, type Localization } from "@mui/material/locale";
import type { Theme } from "@mui/material/styles";
import { createTheme, ThemeProvider as MuiThemeProvider, useColorScheme } from "@mui/material/styles";
import type { FC, PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const getInitialTheme = (): ThemeMode => {
	const storedPreference = localStorage.getItem("mui-mode");
	if (storedPreference && (storedPreference === "light" || storedPreference === "dark")) {
		return storedPreference;
	}

	const prefersDarkMode = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
	return prefersDarkMode ? "dark" : "light";
};

interface ThemeContextPropsType {
	mode: ThemeMode;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextPropsType>({
	mode: "light",
	toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const { mode, setMode } = useColorScheme();
	const currentMode = mode === "light" || mode === "dark" ? mode : getInitialTheme();
	useEffect(() => {
		setMode(currentMode);
	}, []);

	const toggleTheme = useCallback(() => {
		const newMode: ThemeMode = currentMode === "light" ? "dark" : "light";
		setMode(newMode);
	}, [currentMode, setMode]);

	const value = useMemo(() => ({ mode: currentMode, toggleTheme }), [currentMode, toggleTheme]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
	const { i18n } = useTranslation();
	const localeMap: Record<string, Localization> = {
		en: enUS,
		de: deDE,
		ar: arSA,
		ru: ruRU,
		ja: jaJP,
	};
	const muiTheme = useMemo(() => getMuiTheme(i18n.dir(), localeMap[i18n.language] || enUS), [i18n, localeMap]);

	return (
		<MuiThemeProvider theme={muiTheme}>
			<CssBaseline />
			<ThemeContextProvider>{children}</ThemeContextProvider>
		</MuiThemeProvider>
	);
};

export const getMuiTheme = (direction: "ltr" | "rtl", locale: Localization): Theme =>
	createTheme(
		{
			direction,
			// // https://mui.com/material-ui/customization/css-theme-variables/configuration/#toggling-dark-mode-manually
			// // https://mui.com/material-ui/customization/palette/#color-schemes
			colorSchemes: {
				light: {
					palette: {
						background: { default: "#ffffff", paper: "#f5f5f5" },
						text: { primary: "#000000", secondary: "#3c3c3c" },
						primary: { main: "#1565c0" },
					},
				},
				dark: {
					palette: {
						background: { default: "#000000", paper: "#121212" },
						text: { primary: "#ffffff", secondary: "#d1d1d1" },
						primary: { main: "#90caf9" },
					},
				},
			},
			cssVariables: {
				colorSchemeSelector: "class",
			},
		},
		locale,
	);
