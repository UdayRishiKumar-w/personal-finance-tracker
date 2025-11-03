import { defineConfig } from "i18next-cli";

export default defineConfig({
	locales: ["en", "de", "ar", "ru", "ja"],
	extract: {
		input: "src/**/*.{js,jsx,ts,tsx}",
		output: "public/locales/{{language}}/{{namespace}}.json",
		ignore: ["node_modules/**"],
		removeUnusedKeys: false,
		generateBasePluralForms: true,
	},
	types: {
		input: ["public/locales/en/*.json"],
		output: "src/@types/i18next.d.ts",
		resourcesFile: "src/@types/resources.d.ts",
		enableSelector: true, // Enable type-safe key selection
	},
});
