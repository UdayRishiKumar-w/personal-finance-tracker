import { expect, test } from "@playwright/test";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";

test.describe("NotFound route", () => {
	test("unknown path shows 404 and navigates back to dashboard", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await page.goto("/some/unknown/path");
		await expect(page.getByRole("heading", { name: /404 - page not found/i })).toBeVisible();
		await page.getByRole("button", { name: /go to dashboard/i }).click();
		await expect(page).toHaveURL(/\/dashboard$/);
	});
});
