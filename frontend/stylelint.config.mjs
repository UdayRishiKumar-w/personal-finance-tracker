/** @type {import('stylelint').Config} */
export default {
	extends: ["stylelint-config-standard", "stylelint-config-tailwindcss", "stylelint-prettier/recommended"],
	overrides: [
		{
			files: ["**/*.{jsx,tsx}"],
			customSyntax: "postcss-html", // enables JSX/TSX parsing
		},
	],
	rules: {
		"custom-property-pattern": null,
		"number-max-precision": null,
	},
	ignoreFiles: ["**/node_modules/**", "**/dist/**", "**/*.js", "**/*.ts"],
};
