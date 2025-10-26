import { getLangSupported } from "@/utils/commonUtils";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export default i18next
	.use(LanguageDetector)
	.use(Backend) // https://www.i18next.com/how-to/caching#browser-caching-with-local-storage - add
	.use(initReactI18next)
	.init({
		returnObjects: true,
		fallbackLng: (code) => {
			return getLangSupported(code);
		}, // Language to fallback to if the selected is not configured
		debug: import.meta.env.DEV, //To enable us see errors
		// lng: "en", //Default language as english, disabled as using language detector
		interpolation: {
			escapeValue: false,
		},
		saveMissing: true,
		detection: {
			order: ["querystring", "navigator"],
			// caches: ["localStorage"],
			lookupQuerystring: "lng",
		},
		load: "languageOnly",
	});

//  https://github.com/i18next/i18next-cli for translation files extraction
// npx i18next-cli extract
// npx i18next-cli types
// run commands to generate keys
