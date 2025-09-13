/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true, // Enables global test APIs like `describe`, `it`, etc.
		environment: "jsdom", // Use jsdom for simulating browser environment
		include: ["tests/**/*.test.{ts,tsx}"], // Look for tests in tests folder
		setupFiles: "./tests/setup.ts", // Setup file (optional)
		coverage: {
			enabled: true,
			include: ["src/**"],
			provider: "v8",
			exclude: [...configDefaults.exclude, "*.config.*"],
		},
		printConsoleTrace: true,
		// reporters: ['text', "html"],
		// typecheck: {
		// 	enabled: true,
		// 	allowJs: true,
		// },
		// sequence: { concurrent: true },
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@tests": fileURLToPath(new URL("./tests", import.meta.url)),
			"src/function": resolve(__dirname, "./tests/mockFunctions.ts"),
		},
	},
});
