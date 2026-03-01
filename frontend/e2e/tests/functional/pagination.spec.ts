import type { TransactionData } from "@/types/globalTypes";
import { expect, test } from "@playwright/test";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { mockTransactions } from "../../fixtures/routes";

const makeRows = (n: number): TransactionData[] =>
	Array.from({ length: n }, (_, i) => ({
		id: i + 1,
		title: `Row ${i + 1}`,
		amount: (i + 1) * 10,
		date: "2026-01-01",
		category: "Test",
		type: i % 2 ? "INCOME" : "EXPENSE",
	}));

test.describe("Transactions pagination", () => {
	test("navigates pages and shows correct slice", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		const rows = makeRows(25);
		await mockTransactions(page, rows);
		await page.goto("/transactions");

		await expect(page.getByText(/^row 1$/i)).toBeVisible();
		await expect(page.getByText(/^row 11$/i)).toHaveCount(0);

		await page.getByLabel(/go to next page/i).click();
		await expect(page.getByText(/^row 11$/i)).toBeVisible();
		await expect(page.getByText(/^row 1$/i)).toHaveCount(0);
	});
});
