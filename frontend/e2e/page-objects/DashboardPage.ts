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
		this.balanceLabel = page.getByRole("heading", { name: /balance/i });
		this.incomeLabel = page.getByRole("heading", { name: /total income/i });
		this.expenseLabel = page.getByRole("heading", { name: /total expense/i });
		this.logoutButton = page.getByRole("button", { name: /logout/i });
	}

	async goto() {
		await this.navigateTo("/dashboard");
	}

	async logout() {
		const logoutBtn = this.page.getByRole("button", { name: /logout/i });

		// Check if logout button is visible (desktop)
		if (await logoutBtn.isVisible()) {
			await logoutBtn.click();
			return;
		}

		// Mobile flow - open menu first
		const menuButton = this.page.getByLabel(/toggle menu/i);
		await menuButton.click();
		await this.page.getByRole("button", { name: /logout/i }).click();
	}

	getCardValue(label: "balance" | "income" | "expense") {
		const card = this.page.getByTestId(`${label}-card`);
		return card.getByRole("heading", { name: /^\d+(\.\d{2})?$/ });
	}
}
