import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly loginButton: Locator;
	readonly emailError: Locator;
	readonly passwordError: Locator;
	readonly languageSelector: Locator;

	constructor(page: Page) {
		super(page);
		this.emailInput = page.getByRole("textbox", { name: /email/i });
		this.passwordInput = page.locator("input[name='password']");
		this.loginButton = page.getByRole("button", { name: /login/i });
		this.emailError = page.getByText(/invalid email/i);
		this.passwordError = page.getByText(/password is required/i);
		this.languageSelector = page.getByRole("combobox", { name: /select the localization language/i });
	}

	async goto() {
		await this.navigateTo("/login");
	}

	async login(email: string, pass: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(pass);
		await this.loginButton.click();
	}

	async switchLanguage(langName: string | RegExp) {
		await this.languageSelector.click();
		await this.page.getByRole("option", { name: langName }).click();
	}

	async blurFields() {
		await this.emailInput.focus();
		await this.passwordInput.focus();
		await this.emailInput.blur();
		await this.passwordInput.blur();
	}
}
