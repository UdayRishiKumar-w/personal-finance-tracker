/** @type {import('stylelint').Config} */
export default {
	extends: ["stylelint-config-standard", "stylelint-config-tailwindcss", "stylelint-prettier/recommended"],
	overrides: [
		{
			files: ["**/*.{jsx,tsx}"],
			customSyntax: "postcss-html", // enables JSX/TSX parsing
		},
	],
	plugins: ["stylelint-high-performance-animation"],
	rules: {
		"plugin/no-low-performance-animation-properties": true,
		"custom-property-pattern": null,
		"number-max-precision": null,
		"selector-class-pattern": null,
	},
	ignoreFiles: [
		"/node_modules/**",
		"/dist/**",
		"/dev-dist/**",
		"**/*.js",
		"**/*.ts",
		"/coverage/**",
		"/playwright-report/**",
		"/test-results/**",
	],
};
