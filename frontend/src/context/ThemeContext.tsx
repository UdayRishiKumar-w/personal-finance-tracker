import type { ThemeMode } from "@/types/globalTypes";
import CssBaseline from "@mui/material/CssBaseline";
import { arSA, deDE, enUS, jaJP, ruRU, type Localization } from "@mui/material/locale";
import type { Theme } from "@mui/material/styles";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
	const { i18n } = useTranslation();
	const localeMap: Record<string, Localization> = {
		en: enUS,
		de: deDE,
		ar: arSA,
		ru: ruRU,
		ja: jaJP,
	};

	// On initial load, check for saved theme in localStorage or system preference
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

	const muiTheme = useMemo(() => {
		console.log("i18n.dir(): ", i18n.dir());
		console.log("lang: ", i18n.language);
		console.log("locale: ", localeMap[i18n.language]);
		const theme = getMuiTheme(mode, i18n.dir(), localeMap[i18n.language] || enUS);
		console.log("ThemeContext", theme);
		return theme;
	}, [mode, i18n.dir(), i18n.language]);

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
