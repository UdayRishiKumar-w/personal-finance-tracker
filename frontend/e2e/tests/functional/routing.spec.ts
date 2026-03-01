import { expect, test } from "@playwright/test";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { mockTransactions } from "../../fixtures/routes";

test.describe("Routing and protection", () => {
	test("unauthenticated user is redirected to login when accessing protected routes", async ({ page }) => {
		await page.goto("/dashboard");
		await expect(page).toHaveURL(/\/login$/);
		await expect(page.getByRole("heading", { name: /login/i })).toBeVisible();
	});

	test("authenticated user can access dashboard and transactions", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await mockTransactions(page, []);
		await page.goto("/dashboard");
		await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
		await page.goto("/transactions");
		await expect(page.getByText(/transactions/i)).toBeVisible();
	});

	test("root path redirects to dashboard", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await page.goto("/");
		await expect(page).toHaveURL(/\/dashboard$/);
	});
});
