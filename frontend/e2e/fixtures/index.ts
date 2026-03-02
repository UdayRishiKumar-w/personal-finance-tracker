import { test as base, expect } from "@playwright/test";
import { DashboardPage } from "../page-objects/DashboardPage";
import { LoginPage } from "../page-objects/LoginPage";
import { SignupPage } from "../page-objects/SignupPage";
import { TransactionsPage } from "../page-objects/TransactionsPage";

type MyFixtures = {
	loginPage: LoginPage;
	signupPage: SignupPage;
	dashboardPage: DashboardPage;
	transactionsPage: TransactionsPage;
	toggleTheme: () => Promise<void>;
	switchLanguage: (lang: string | RegExp) => Promise<void>;
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
	toggleTheme: async ({ page, isMobile }, use) => {
		const toggle = async () => {
			const isDarkBefore = await page.locator("html").evaluate((el) => el.classList.contains("dark"));

			if (isMobile) {
				const menuButton = page.getByLabel(/toggle menu/i);
				await expect(menuButton).toBeVisible();
				await menuButton.click();

				// Wait for the theme button inside the mobile menu to be visible
				const mobileThemeButton = page.getByTestId("mobile-menu").getByLabel(/button to toggle theme/i);
				await expect(mobileThemeButton).toBeVisible({ timeout: 10000 });
				await mobileThemeButton.click();

				// Close menu after toggle
				await menuButton.click();
				await expect(mobileThemeButton).toBeHidden();
			} else {
				const desktopThemeButton = page.getByTestId("desktop-nav").getByLabel(/button to toggle theme/i);
				await expect(desktopThemeButton).toBeVisible();
				await desktopThemeButton.click();
			}

			if (isDarkBefore) {
				await expect(page.locator("html")).not.toHaveClass(/dark/);
			} else {
				await expect(page.locator("html")).toHaveClass(/dark/);
			}
		};
		await use(toggle);
	},
	switchLanguage: async ({ page, isMobile }, use) => {
		const switchLang = async (langName: string | RegExp) => {
			if (isMobile) {
				const menuButton = page.getByLabel(/toggle menu/i);
				await expect(menuButton).toBeVisible();
				await menuButton.click();

				const mobileLangSelector = page
					.getByTestId("mobile-menu")
					.getByRole("combobox", { name: /select the localization language/i });
				await expect(mobileLangSelector).toBeVisible({ timeout: 10000 });
				await mobileLangSelector.click();
			} else {
				const desktopLangSelector = page
					.getByTestId("desktop-nav")
					.getByRole("combobox", { name: /select the localization language/i });
				await expect(desktopLangSelector).toBeVisible();
				await desktopLangSelector.click();
			}

			await page.getByRole("option", { name: langName }).click();

			if (isMobile) {
				const menuButton = page.getByLabel(/toggle menu/i);
				await menuButton.click(); // Close menu
			}
		};
		await use(switchLang);
	},
});

export { expect } from "@playwright/test";
