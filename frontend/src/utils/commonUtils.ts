import { languageOptions } from "@/Constants";
import type { ThemeMode } from "@/types/globalTypes";

export const getLangSupported = (lang: string): (typeof languageOptions)[number]["code"] => {
	const langSupported = languageOptions.find(({ code }) => lang === code || lang.startsWith(`${code}-`));

	return langSupported ? langSupported.code : "en";
};

export const getInitialTheme = (): ThemeMode => {
	const storedPreference = localStorage.getItem("theme");
	if (storedPreference && (storedPreference === "light" || storedPreference === "dark")) {
		document.documentElement.classList.toggle("dark", storedPreference === "dark");
		return storedPreference;
	}

	const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const preferMode = prefersDarkMode ? "dark" : "light";
	document.documentElement.classList.toggle("dark", prefersDarkMode);
	localStorage.setItem("theme", preferMode);
	return preferMode;
};
