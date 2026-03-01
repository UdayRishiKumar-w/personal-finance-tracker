import { test as base } from "@playwright/test";
import { DashboardPage } from "../page-objects/DashboardPage";
import { LoginPage } from "../page-objects/LoginPage";
import { SignupPage } from "../page-objects/SignupPage";
import { TransactionsPage } from "../page-objects/TransactionsPage";

type MyFixtures = {
	loginPage: LoginPage;
	signupPage: SignupPage;
	dashboardPage: DashboardPage;
	transactionsPage: TransactionsPage;
};

export const test = base.extend<MyFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},
	signupPage: async ({ page }, use) => {
		await use(new SignupPage(page));
	},
	dashboardPage: async ({ page }, use) => {
		await use(new DashboardPage(page));
	},
	transactionsPage: async ({ page }, use) => {
		await use(new TransactionsPage(page));
	},
});

export { expect } from "@playwright/test";
