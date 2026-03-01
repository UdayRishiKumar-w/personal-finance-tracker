import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SignupPage extends BasePage {
	readonly firstNameInput: Locator;
	readonly lastNameInput: Locator;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly signupButton: Locator;

	constructor(page: Page) {
		super(page);
		this.firstNameInput = page.getByRole("textbox", { name: /first name/i });
		this.lastNameInput = page.getByRole("textbox", { name: /last name/i });
		this.emailInput = page.getByRole("textbox", { name: /email/i });
		this.passwordInput = page.locator("input[name='password']");
		this.signupButton = page.getByRole("button", { name: /sign up/i });
	}

	async goto() {
		await this.navigateTo("/signup");
	}

	async signup(firstName: string, lastName: string, email: string, pass: string) {
		await this.firstNameInput.fill(firstName);
		await this.lastNameInput.fill(lastName);
		await this.emailInput.fill(email);
		await this.passwordInput.fill(pass);
		await this.signupButton.click();
	}
}
