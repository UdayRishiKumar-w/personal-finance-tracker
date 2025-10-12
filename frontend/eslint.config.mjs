import eslintPluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
// import eslintPluginTailwindcss from "eslint-plugin-tailwindcss";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslintPluginPlaywright from "eslint-plugin-playwright";
import eslintPluginReactRedux from "eslint-plugin-react-redux";
import testingLibrary from "eslint-plugin-testing-library";
import eslintPluginVitest from "eslint-plugin-vitest";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist", "dev-dist", "coverage", "playwright-report", "test-results"]),
	// Base JS rules
	eslintPluginJs.configs.recommended,

	// TypeScript rules
	tseslint.configs.recommendedTypeChecked,
	// ...eslintPluginTailwindcss.configs["flat/recommended"],

	{
		rules: {
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-misused-promises": "off",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/promise-function-async": "off",
		},
	},
	{
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ["**/*.js", "**/*.mjs"],
		extends: [tseslint.configs.disableTypeChecked],
	},
	{
		...eslintPluginReactRedux.configs.recommended,
		files: ["src/**/*.ts", "src/**/*.tsx"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser,
				...globals.es2025,
				...globals.serviceworker,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		extends: [reactRefresh.configs.vite],
		plugins: {
			react: eslintPluginReact,
			"react-hooks": eslintPluginReactHooks,
			"jsx-a11y": eslintPluginJsxA11y,
			prettier: eslintPluginPrettier,
			"@tanstack/query": pluginQuery,
		},
		rules: {
			...eslintPluginReactHooks.configs.recommended.rules,
			// "tailwindcss/no-custom-classname": "off",
			"react-refresh/only-export-components": "off",

			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "off",
			"react-hooks/set-state-in-effect": "off",
			"prefer-arrow-callback": "error",
			"no-else-return": ["error", { allowElseIf: false }],
			"no-lonely-if": "error",
			"no-useless-return": "error",
			"object-shorthand": "error",
			"operator-assignment": "error",
			"prefer-destructuring": "error",
			"logical-assignment-operators": "error",

			"@typescript-eslint/consistent-indexed-object-style": "error",
			"@typescript-eslint/prefer-optional-chain": "error",
			"@typescript-eslint/prefer-readonly": "error",
			"@typescript-eslint/consistent-type-exports": "error",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-this-alias": "error",
			"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
			// "no-console": process.env.NODE_ENV === "production" ? "warn" : "off", // as using no console plugin
			"no-console": "off",
			"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
			...pluginQuery.configs["flat/recommended"][0].rules,
			"no-restricted-imports": [
				"error",
				{
					patterns: [{ regex: "^@mui/[^/]+$" }],
				},
			],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},

	// Prettier overrides (disable conflicting formatting rules)
	{
		rules: {
			...prettierConfig.rules,
		},
	},

	// React Testing Library + Vitest unit tests
	{
		files: ["tests/**/*.ts", "tests/**/*.tsx"],
		...testingLibrary.configs["flat/react"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...eslintPluginVitest.environments.env.globals,
			},
		},
		plugins: {
			vitest: eslintPluginVitest,
			prettier: eslintPluginPrettier,
		},
		rules: {
			...eslintPluginVitest.configs.recommended.rules,
		},
	},

	// e2e
	{
		...eslintPluginPlaywright.configs["flat/recommended"],
		files: ["e2e/**/*.ts"],
		plugins: {
			playwright: eslintPluginPlaywright,
		},
		rules: {
			...eslintPluginPlaywright.configs["flat/recommended"].rules,
		},
	},
]);
