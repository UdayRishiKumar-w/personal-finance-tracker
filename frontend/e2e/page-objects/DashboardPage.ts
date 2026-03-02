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
		this.balanceLabel = page.getByTestId("balance-card").getByText(/balance/i);
		this.incomeLabel = page.getByTestId("income-card").getByText(/total income/i);
		this.expenseLabel = page.getByTestId("expense-card").getByText(/total expense/i);
		this.logoutButton = page.getByTestId("desktop-logout-button").or(page.getByTestId("mobile-logout-button"));
	}

	async goto() {
		await this.navigateTo("/dashboard");
	}

	async logout() {
		const desktopLogout = this.page.getByTestId("desktop-logout-button");
		if (await desktopLogout.isVisible()) {
			await desktopLogout.click();
			return;
		}

		// Mobile flow
		const menuButton = this.page.getByLabel(/toggle menu/i);
		await menuButton.click();
		await this.page.getByTestId("mobile-logout-button").click();
	}

	getCardValue(label: "balance" | "income" | "expense") {
		const card = this.page.getByTestId(`${label}-card`);
		return card.getByRole("heading", { name: /^\d+(\.\d{2})?$/ });
	}
}
