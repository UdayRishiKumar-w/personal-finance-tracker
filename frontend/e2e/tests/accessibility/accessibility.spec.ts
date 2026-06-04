import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";
import { mockTransactions } from "../../fixtures/routes";
import { analyzeA11y } from "../../utils/accessibility";

test.describe("Accessibility", () => {
	const themes = ["light", "dark"] as const;

	for (const theme of themes) {
		test.describe(`${theme} theme`, () => {
			test.beforeEach(async ({ page }) => {
				// make MUI theme via localStorage before any script runs
				await page.addInitScript((theme) => {
					localStorage.setItem("mui-mode", theme);
				}, theme);
				await page.goto("/");
				await expect(page.locator("html")).toHaveClass(new RegExp(theme));
			});

			test("login page has no serious violations", async ({ page, loginPage }) => {
				await loginPage.goto();
				await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
				const { serious } = await analyzeA11y(page);
				expect(serious.map((v) => v.id)).toEqual([]);
			});

			test("signup page has no serious violations", async ({ page, signupPage }) => {
				await signupPage.goto();
				await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
				const { serious } = await analyzeA11y(page);
				expect(serious.map((v) => v.id)).toEqual([]);
			});

			test.fixme("dashboard has no serious violations", async ({ page, dashboardPage }) => {
				await ensureAuthenticated(page, defaultUser);
				await mockTransactions(page, []);
				await dashboardPage.goto();
				await expect(dashboardPage.heading).toBeVisible();
				const { serious } = await analyzeA11y(page);
				expect(serious.map((v) => v.id)).toEqual([]);
			});

			test.fixme("transactions page has no serious violations", async ({ page, transactionsPage }) => {
				await ensureAuthenticated(page, defaultUser);
				await mockTransactions(page, []);
				await transactionsPage.goto();
				await expect(transactionsPage.heading).toBeVisible();
				const { serious } = await analyzeA11y(page);
				expect(serious.map((v) => v.id)).toEqual([]);
			});
		});
	}
});
