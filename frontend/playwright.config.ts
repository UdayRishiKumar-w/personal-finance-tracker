import { defineConfig, devices } from "@playwright/test";

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
		baseURL: "http://localhost:5173", // Vite default port
		headless: !!process.env.CI,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 0,
		trace: "on-first-retry",
		ignoreHTTPSErrors: true,
		video: "retain-on-failure",
	},
	webServer: {
		command: "npm run dev",
		port: 5173,
		reuseExistingServer: !process.env.CI,
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
