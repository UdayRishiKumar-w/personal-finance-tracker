import { expect, test } from "../../fixtures/index";

test.describe("Internationalization", () => {
	test("switch language updates labels and html attributes", async ({ page, loginPage, switchLanguage }) => {
		await loginPage.goto();

		// Switch to German
		await switchLanguage(/deutsch/i);

		// Verify HTML lang attribute
		await expect(page.locator("html")).toHaveAttribute("lang", "de");

		// Verify German text appears
		await expect(page.getByRole("button", { name: /anmelden/i })).toBeVisible({ timeout: 15000 });
	});
});
