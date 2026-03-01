import { expect, test } from "@playwright/test";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { mockTransactions } from "../../fixtures/routes";

test.describe("Charts visibility", () => {
	test("monthly chart canvas renders", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await mockTransactions(page, []);
		await page.goto("/dashboard");
		await expect(page.getByText(/income vs expense \(last 6 months\)/i)).toBeVisible();
		await expect(page.getByLabel(/income vs expense chart/i)).toBeVisible();
	});
});
