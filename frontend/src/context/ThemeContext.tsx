import type { ThemeMode } from "@/types/globalTypes";
import CssBaseline from "@mui/material/CssBaseline";
import { arSA, deDE, enUS, jaJP, ruRU, type Localization } from "@mui/material/locale";
import type { Theme } from "@mui/material/styles";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import type { FC, PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const getInitialTheme = (): ThemeMode => {
	const storedPreference = localStorage.getItem("theme");
	if (storedPreference && (storedPreference === "light" || storedPreference === "dark")) {
		document.documentElement.classList.toggle("dark", storedPreference === "dark");
		return storedPreference;
	}

	const prefersDarkMode = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
	const preferMode = prefersDarkMode ? "dark" : "light";
	document.documentElement.classList.toggle("dark", prefersDarkMode);
	localStorage.setItem("theme", preferMode);
	return preferMode;
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

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
	// On initial load, check for saved theme in localStorage or system preference
	const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
	const { i18n } = useTranslation();
	const localeMap: Record<string, Localization> = {
		en: enUS,
		de: deDE,
		ar: arSA,
		ru: ruRU,
		ja: jaJP,
	};

	const toggleTheme = useCallback(() => {
		const newMode: ThemeMode = mode === "light" ? "dark" : "light";
		document.documentElement.classList.toggle("dark", newMode === "dark");
		localStorage.setItem("theme", newMode);
		setMode(newMode);
	}, [mode]);

	const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

	const muiTheme = useMemo(
		() => getMuiTheme(mode, i18n.dir(), localeMap[i18n.language] || enUS),
		[mode, i18n, localeMap],
	);

	return (
		<ThemeContext.Provider value={value}>
			<MuiThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export const getMuiTheme = (mode: ThemeMode, direction: "ltr" | "rtl", locale: Localization): Theme =>
	createTheme(
		{
			direction,
			// // https://mui.com/material-ui/customization/css-theme-variables/configuration/#toggling-dark-mode-manually
			// // https://mui.com/material-ui/customization/palette/#color-schemes
			colorSchemes: { light: true, dark: true },
			cssVariables: {
				colorSchemeSelector: "user-color-scheme", // change it later
				// disableCssColorScheme: true,
			},
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
		},
		locale,
	);
