const Constants = Object.freeze({
	errorMessage: "An Error occurred, please try again later!",
} as const);

export default Constants;

export const languageOptions = [
	{ language: "English", code: "en" },
	{ language: "Deutsch", code: "de" },
	{ language: "العربية", code: "ar" },
	{ language: "Русский", code: "ru" },
	{ language: "日本語", code: "ja" },
] as const;

export type LanguageCode = (typeof languageOptions)[number]["code"];
