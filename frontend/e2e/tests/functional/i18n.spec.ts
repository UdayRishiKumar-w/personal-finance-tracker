import { expect, test } from "../../fixtures/index";

test.describe("Internationalization", () => {
	test("switch language updates labels and html attributes", async ({ page, loginPage }) => {
		await loginPage.goto();

		// Switch to German
		await loginPage.switchLanguage(/deutsch/i);

		// Verify HTML lang attribute
		await expect(page.locator("html")).toHaveAttribute("lang", "de");

		// Use getByText with a regular expression for case-insensitive matching
		// and use a longer timeout to allow for translations to load.
		await expect(page.getByText(/anmelden/i).first()).toBeVisible({ timeout: 15000 });
		await expect(page.getByText(/e-mail/i).first()).toBeVisible();
	});
});
