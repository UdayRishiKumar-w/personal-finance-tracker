/* eslint-disable playwright/no-skipped-test */
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";

test.describe("Theme toggle", () => {
	test.beforeEach(async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await page.goto("/dashboard");
	});

	test("toggles between dark and light mode (desktop)", async ({ page, isMobile, toggleTheme }) => {
		test.skip(isMobile, "Desktop only test");

		await toggleTheme();
		await expect(page.locator("html")).toHaveClass(/dark/);
		await toggleTheme();
		await expect(page.locator("html")).not.toHaveClass(/dark/);
	});

	test("toggles between dark and light mode (mobile)", async ({ page, isMobile, toggleTheme }) => {
		test.skip(!isMobile, "Mobile only test");

		await toggleTheme();
		await expect(page.locator("html")).toHaveClass(/dark/);
		await toggleTheme();
		await expect(page.locator("html")).not.toHaveClass(/dark/);
	});
});
