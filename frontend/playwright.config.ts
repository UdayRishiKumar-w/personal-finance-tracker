import { defineConfig, devices } from "@playwright/test";

const IS_CI = !!process.env.CI;
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "e2e/tests",
	timeout: 60_000,
	workers: IS_CI ? 4 : undefined,
	retries: IS_CI ? 2 : 1,
	fullyParallel: true,
	outputDir: "test-results",
	forbidOnly: IS_CI,
	reporter: [
		["list"],
		["html", { open: "never", outputFolder: "playwright-report" }],
		["junit", { outputFile: "test-results/results.xml" }],
		["json", { outputFile: "test-results/results.json" }],
	],
	expect: {
		timeout: 15_000,
	},
	use: {
		baseURL: BASE_URL,
		headless: IS_CI,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 30_000,
		navigationTimeout: 30_000,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		ignoreHTTPSErrors: true,
		video: "retain-on-failure",
		locale: "en-US",
	},
	webServer: {
		command: "npm run build:e2e && npm run preview",
		port: PORT,
		reuseExistingServer: !IS_CI,
		timeout: 240_000,
		stdout: "pipe",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
		{ name: "webkit", use: { ...devices["Desktop Safari"] } },
		{ name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
		{ name: "mobile-webkit", use: { ...devices["iPhone 12"] } },
	],
});
