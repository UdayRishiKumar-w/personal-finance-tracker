import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
	readonly heading: Locator;
	readonly balanceLabel: Locator;
	readonly incomeLabel: Locator;
	readonly expenseLabel: Locator;
	readonly logoutButton: Locator;

	constructor(page: Page) {
		super(page);
		this.heading = page.getByRole("heading", { name: /dashboard/i });
		this.balanceLabel = page.getByLabel(/balance/i);
		this.incomeLabel = page.getByLabel(/total income/i);
		this.expenseLabel = page.getByLabel(/total expense/i);
		this.logoutButton = page.getByTitle(/logout/i);
	}

	async goto() {
		await this.navigateTo("/dashboard");
	}

	async logout() {
		await this.logoutButton.click();
	}

	getCardValue(label: Locator) {
		return this.page.getByRole("heading", { name: /^\d+(\.\d{2})?$/ }).filter({ has: label });
	}
}
