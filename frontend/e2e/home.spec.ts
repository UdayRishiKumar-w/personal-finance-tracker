import { expect, test } from "@playwright/test";

test("homepage has personal text", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("h1")).toContainText(/personal/i);
});
