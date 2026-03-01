/* eslint-disable playwright/no-skipped-test */
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";

test.describe("Theme toggle", () => {
	test.beforeEach(async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await page.goto("/dashboard");
	});

	test("toggles between dark and light mode (desktop)", async ({ page, isMobile }) => {
		test.skip(isMobile, "Desktop only test");
		const themeButton = page.getByLabel(/button to toggle theme between dark and light/i).first();

		await themeButton.click();
		await expect(page.locator("html")).toHaveClass(/dark/);

		await themeButton.click();
		await expect(page.locator("html")).not.toHaveClass(/dark/);
	});

	test("toggles between dark and light mode (mobile)", async ({ page, isMobile }) => {
		test.skip(!isMobile, "Mobile only test");
		const themeButton = page.getByLabel(/button to toggle theme between dark and light/i).last();
		const menuButton = page.getByLabel(/toggle menu/i);

		const toggleTheme = async () => {
			await menuButton.click();
			await themeButton.click();
			await menuButton.click();
		};

		await toggleTheme();
		await expect(page.locator("html")).toHaveClass(/dark/);

		await toggleTheme();
		await expect(page.locator("html")).not.toHaveClass(/dark/);
	});
});
