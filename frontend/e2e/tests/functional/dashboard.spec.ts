import type { TransactionData } from "@/types/globalTypes";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";
import { mockTransactions } from "../../fixtures/routes";
import { analyzeA11y } from "../../utils/accessibility";

const sampleTx: TransactionData[] = [
	{ id: 1, title: "Salary", amount: 5000, date: "2026-01-01", category: "Income", type: "INCOME" },
	{ id: 2, title: "Rent", amount: 1200, date: "2026-01-03", category: "Housing", type: "EXPENSE" },
	{ id: 3, title: "Groceries", amount: 300, date: "2026-01-05", category: "Food", type: "EXPENSE" },
];

test.describe("Dashboard", () => {
	test("shows computed totals and recent transactions", async ({ page, dashboardPage }) => {
		await ensureAuthenticated(page, defaultUser);
		await mockTransactions(page, sampleTx);
		await dashboardPage.goto();

		const totalIncome = 5000;
		const totalExpense = 1500;
		const balance = (totalIncome - totalExpense).toFixed(2);

		await expect(dashboardPage.balanceLabel).toBeVisible();
		await expect(page.getByRole("heading", { name: balance })).toBeVisible();

		await expect(dashboardPage.incomeLabel).toBeVisible();
		await expect(page.getByRole("heading", { name: totalIncome.toFixed(2) })).toBeVisible();

		await expect(dashboardPage.expenseLabel).toBeVisible();
		await expect(page.getByRole("heading", { name: totalExpense.toFixed(2) })).toBeVisible();

		await expect(page.getByText(/recent transactions/i)).toBeVisible();
		await expect(page.getByText(/salary/i)).toBeVisible();
		await expect(page.getByText(/rent/i)).toBeVisible();
	});

	test("error handling on API failure", async ({ page, dashboardPage }) => {
		await ensureAuthenticated(page, defaultUser);
		await page.route("**/api/transactions?**", async (route) => {
			await route.fulfill({
				status: 500,
				contentType: "application/json",
				body: JSON.stringify({ message: "Internal Server Error" }),
			});
		});
		await dashboardPage.goto();
		await expect(page.getByText(/failed to load dashboard data/i)).toBeVisible();
	});

	test("a11y: no serious or critical violations on dashboard", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await mockTransactions(page, sampleTx);
		await page.goto("/dashboard");
		const { serious } = await analyzeA11y(page);
		expect(serious.map((v) => v.id)).toEqual([]);
	});
});
