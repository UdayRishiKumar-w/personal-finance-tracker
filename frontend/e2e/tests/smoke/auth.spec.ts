import {
	defaultUser,
	mockLoginFailure,
	mockLoginSuccess,
	mockLogout,
	mockMe,
	mockSignupSuccess,
} from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";
import { mockTransactions } from "../../fixtures/routes";

test.describe("Authentication", () => {
	test("login success redirects to dashboard", async ({ page, loginPage, dashboardPage }) => {
		await mockLoginSuccess(page, defaultUser);
		await mockTransactions(page, []);
		await loginPage.goto();
		await loginPage.login(defaultUser.email, "StrongPassw0rd!");
		await dashboardPage.waitForURL(/\/dashboard$/);
		await expect(dashboardPage.heading).toBeVisible();
	});

	test("login failure shows error snackbar", async ({ page, loginPage }) => {
		await mockLoginFailure(page, "Invalid credentials");
		await loginPage.goto();
		await loginPage.login("wrong@example.com", "bad");
		await expect(loginPage.getSnackbar()).toHaveText(/invalid credentials/i);
		await expect(page).toHaveURL(/\/login$/);
	});

	test("login form validation shows errors on blur", async ({ loginPage }) => {
		await loginPage.goto();
		await loginPage.blurFields();
		await expect(loginPage.emailError).toBeVisible();
		await expect(loginPage.passwordError).toBeVisible();
	});

	test("signup success redirects to dashboard", async ({ page, signupPage, dashboardPage }) => {
		await mockSignupSuccess(page, defaultUser);
		await mockLoginSuccess(page, defaultUser);
		await mockTransactions(page, []);
		await signupPage.goto();
		await signupPage.signup("Test", "User", defaultUser.email, "StrongPassw0rd!");
		await expect(page).toHaveURL(/\/dashboard$/);
		await expect(dashboardPage.heading).toBeVisible();
	});

	test("logout clears auth and redirects to login", async ({ page, dashboardPage, loginPage }) => {
		// Mock authenticated state
		await page.addInitScript(() => localStorage.setItem("isLoggedIn", "true"));
		await mockLogout(page);
		await mockMe(page, defaultUser);
		await dashboardPage.goto();
		await dashboardPage.logout();
		await expect(page).toHaveURL(/\/login$/);
		await expect(loginPage.emailInput).toBeVisible();
	});
});
