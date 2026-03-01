import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";

test.describe("RTL localisation handling", () => {
	test("switch to Arabic sets dir=rtl", async ({ page, loginPage }) => {
		await ensureAuthenticated(page, defaultUser);
		await loginPage.goto();

		await loginPage.switchLanguage(/العربية/i);

		await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
		await expect(page.locator("html")).toHaveAttribute("lang", /ar/i);
	});
});
