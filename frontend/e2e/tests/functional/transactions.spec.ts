import type { TransactionData } from "../../../src/types/globalTypes";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";
import {
	mockCreateTransaction,
	mockDeleteTransaction,
	mockTransactions,
	mockUpdateTransaction,
} from "../../fixtures/routes";

const initialRows: TransactionData[] = [
	{ id: 10, title: "Internet", amount: 60, date: "2026-01-02", category: "Utilities", type: "EXPENSE" },
	{ id: 11, title: "Freelance", amount: 800, date: "2026-01-09", category: "Income", type: "INCOME" },
];

test.describe("Transactions CRUD", () => {
	test.beforeEach(async ({ page, transactionsPage }) => {
		await ensureAuthenticated(page, defaultUser);
		await mockTransactions(page, initialRows);
		await mockCreateTransaction(page);
		await mockUpdateTransaction(page);
		await mockDeleteTransaction(page);
		await transactionsPage.goto();
		// Wait for initial data load - more robust check
		await expect(page.getByRole("cell", { name: /internet/i }).or(page.getByText(/internet/i))).toBeVisible({
			timeout: 10000,
		});
	});

	test("create transaction (positive)", async ({ page, transactionsPage }) => {
		await transactionsPage.openAddDialog();

		// Mock successful creation
		await page.route("**/api/transactions", async (route) => {
			if (route.request().method() === "POST") {
				await route.fulfill({
					status: 201,
					contentType: "application/json",
					body: JSON.stringify({
						...initialRows[0],
						id: 999,
						title: "Lunch",
						amount: 15,
						category: "Food",
					}),
				});
			} else {
				await route.continue();
			}
		});

		await transactionsPage.fillForm({
			title: "Lunch",
			amount: 15,
			category: "Food",
			type: "EXPENSE",
		});

		await transactionsPage.submitForm();
		await expect(transactionsPage.dialog).toBeHidden();
	});

	test("update transaction (positive)", async ({ page, transactionsPage }) => {
		// Mock successful update
		await page.route("**/api/transactions/*", async (route) => {
			if (route.request().method() === "PUT") {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({ ...initialRows[0], title: "Internet Bill" }),
				});
			} else {
				await route.continue();
			}
		});

		await transactionsPage.editFirstTransaction("Internet Bill");
		await expect(transactionsPage.dialog).toBeHidden();
	});

	test("delete transaction (positive)", async ({ transactionsPage }) => {
		await transactionsPage.deleteFirstTransaction();
		await expect(transactionsPage.dialog).toBeHidden();
	});

	test("error fallback when API fails", async ({ page, transactionsPage }) => {
		await page.route("**/api/transactions**", async (route) => {
			await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({}) });
		});
		await transactionsPage.goto();
		await expect(page.getByText(/failed to load transactions/i)).toBeVisible();
	});

	test("form validation (negative): required fields", async ({ transactionsPage }) => {
		await transactionsPage.openAddDialog();
		// Empty the title and category to trigger validation
		await transactionsPage.titleInput.fill("");
		await transactionsPage.categoryInput.fill("");

		await transactionsPage.submitButton.click();

		await expect(transactionsPage.dialog.getByText(/title is required/i)).toBeVisible();
		await expect(transactionsPage.dialog.getByText(/category is required/i)).toBeVisible();
	});

	test("edge: form resets state after cancel", async ({ transactionsPage }) => {
		await transactionsPage.openAddDialog();

		const switchInput = transactionsPage.recurringSwitch;

		await switchInput.click();

		await transactionsPage.cancelButton.click();
		await transactionsPage.openAddDialog();

		await expect(switchInput).not.toBeChecked();
	});
});
