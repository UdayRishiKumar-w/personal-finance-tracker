/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";
// import { playwright } from '@vitest/browser-playwright';

export default defineConfig((configEnv) =>
	mergeConfig(
		viteConfig(configEnv),
		defineConfig({
			// define: {
			// 	"process.env.NODE_ENV": JSON.stringify("unittest"),
			// },
			// plugins: [react()],
			test: {
				globals: true, // Enables global test APIs like `describe`, `it`, etc.
				environment: "jsdom", // Use jsdom for simulating browser environment
				include: ["tests/**/*.test.{ts,tsx}"], // Look for tests in tests folder
				setupFiles: "./tests/setup.ts",
				css: true,
				isolate: true,
				restoreMocks: true,
				clearMocks: true,
				mockReset: true,
				coverage: {
					enabled: true,
					include: ["src/**"],
					provider: "v8", // "istanbul"
					reporter: ["text", "html", "json"],
					exclude: [...configDefaults.exclude, "*.config.*", "**/*.d.ts", "src/@types", "node_modules/"],
				},
				printConsoleTrace: true,
				// reporters: ['text', "html"],
				// typecheck: {
				// 	enabled: true,
				// 	allowJs: true,
				// },
				// sequence: { concurrent: true },
				// browser: {
				// 	provider: playwright(),
				// 	enabled: true,
				// 	instances: [{ browser: "chromium" }],
				// },
			},
			resolve: {
				alias: {
					"@": fileURLToPath(new URL("./src", import.meta.url)),
					"@tests": fileURLToPath(new URL("./tests", import.meta.url)),
					// "src/function": resolve(__dirname, "./tests/mockFunctions.ts"),
				},
			},
		}),
	),
);
