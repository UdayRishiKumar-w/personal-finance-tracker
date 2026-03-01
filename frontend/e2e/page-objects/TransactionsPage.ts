import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransactionsPage extends BasePage {
	readonly addTransactionButton: Locator;
	readonly dialog: Locator;
	readonly titleInput: Locator;
	readonly typeSelect: Locator;
	readonly categoryInput: Locator;
	readonly amountInput: Locator;
	readonly dateInput: Locator;
	readonly submitButton: Locator;
	readonly cancelButton: Locator;
	readonly editButton: Locator;
	readonly deleteButton: Locator;
	readonly confirmDeleteButton: Locator;
	readonly recurringSwitch: Locator;

	constructor(page: Page) {
		super(page);
		this.addTransactionButton = page.getByRole("button", { name: /add/i }).first();
		this.dialog = page.getByRole("dialog");
		this.titleInput = this.dialog.getByLabel(/title/i);
		this.typeSelect = this.dialog.getByLabel(/type/i);
		this.categoryInput = this.dialog.getByLabel(/category/i);
		this.amountInput = this.dialog.getByLabel(/amount/i);
		this.dateInput = this.dialog.getByLabel(/date/i);
		this.recurringSwitch = this.dialog.getByLabel(/recurring/i);
		this.submitButton = this.dialog.getByRole("button", { name: /add|update|save/i }).last();
		this.cancelButton = this.dialog.getByRole("button", { name: /cancel/i });
		this.editButton = page.getByRole("button", { name: /edit/i });
		this.deleteButton = page.getByRole("button", { name: /delete/i });
		this.confirmDeleteButton = page
			.getByRole("dialog")
			.filter({ hasText: /delete/i })
			.getByRole("button", { name: /^delete$/i });
	}

	async goto() {
		await this.navigateTo("/transactions");
		await this.page.waitForLoadState("load");
	}

	async openAddDialog() {
		await this.addTransactionButton.click();
		await this.waitForStable(this.dialog);
	}

	async fillForm(data: {
		title?: string;
		type?: "INCOME" | "EXPENSE";
		category?: string;
		amount?: string | number;
		date?: string;
	}) {
		if (data.title) await this.titleInput.fill(data.title);
		if (data.category) await this.categoryInput.fill(data.category);
		if (data.amount !== undefined) await this.amountInput.fill(data.amount.toString());
		if (data.type) {
			await this.typeSelect.click();
			await this.page.getByRole("option", { name: new RegExp(data.type, "i") }).click();
		}
		if (data.date) {
			await this.dateInput.fill(data.date);
			await this.page.keyboard.press("Enter");
		}
	}

	async submitForm() {
		await this.submitButton.click();
		await expect(this.dialog).toBeHidden({ timeout: 10000 });
	}

	async deleteFirstTransaction() {
		await this.deleteButton.first().click();
		await this.waitForStable(this.page.getByRole("dialog").filter({ hasText: /delete transaction/i }));
		await this.confirmDeleteButton.click();
		await expect(this.page.getByRole("dialog").filter({ hasText: /delete transaction/i })).toBeHidden({
			timeout: 10000,
		});
	}

	async editFirstTransaction(newTitle: string) {
		await this.editButton.first().click();
		await this.waitForStable(this.dialog);
		await this.titleInput.fill(newTitle);
		await this.submitForm();
	}
}
