import { expect, test } from "@playwright/test";

test("homepage has personal finance tracker text", async ({ page }) => {
	await page.goto("/");
	// App redirects from / to /dashboard then to /login if not authenticated
	await page.waitForURL(/\/login$/);
	await expect(page.getByRole("heading", { level: 1 }).or(page.getByText(/personal finance tracker/i))).toBeVisible();
});
