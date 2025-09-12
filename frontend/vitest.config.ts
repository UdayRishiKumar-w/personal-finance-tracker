/// <reference types="vitest" />
import react from "@vitejs/plugin-react-swc";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
		// reporters: ["html"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@tests": resolve(__dirname, "./tests"),
		},
	},
});
