import eslintPluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
// import eslintPluginTailwindcss from "eslint-plugin-tailwindcss";
import eslintPluginPlaywright from "eslint-plugin-playwright";
import eslintPluginVitest from "eslint-plugin-vitest";
import { defineConfig } from "eslint/config";

export default defineConfig(
	// Base JS rules
	eslintPluginJs.configs.recommended,

	// TypeScript rules
	tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ["**/*.js", "**/*.mjs"],
		extends: [tseslint.configs.disableTypeChecked],
	},
	{
		files: ["src/**/*.ts", "src/**/*.tsx"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			react: eslintPluginReact,
			"react-hooks": eslintPluginReactHooks,
			"jsx-a11y": eslintPluginJsxA11y,
			prettier: eslintPluginPrettier,
			// tailwindcss: eslintPluginTailwindcss,
		},
		rules: {},
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
);
