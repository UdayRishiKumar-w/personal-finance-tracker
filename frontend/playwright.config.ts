import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.CI ? 4173 : 5173;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "e2e",
	timeout: 30_000,
	workers: process.env.CI ? 1 : undefined,
	retries: process.env.CI ? 2 : 0,
	fullyParallel: true,
	outputDir: "test-results",
	reporter: "html",
	expect: {
		timeout: 5_000,
	},
	use: {
		baseURL: BASE_URL, // Vite default port
		headless: !!process.env.CI,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 0,
		trace: "on-first-retry",
		ignoreHTTPSErrors: true,
		video: "retain-on-failure",
	},
	webServer: {
		command: process.env.CI ? "npm run build && npm run preview" : "npm run dev",
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		stdout: "pipe",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
});
