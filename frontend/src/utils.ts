import { languageOptions } from "@/Constants";

export const getLangSupported = (lang: string): (typeof languageOptions)[number]["code"] => {
	const langSupported = languageOptions.find(({ code }) => lang.startsWith(code));

	return langSupported ? langSupported.code : "en";
};
