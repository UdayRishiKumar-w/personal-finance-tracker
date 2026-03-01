import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { expect, test } from "../../fixtures/index";
import { analyzeA11y } from "../../utils/accessibility";

test.describe("Accessibility", () => {
	test("login page has no serious violations", async ({ page, loginPage }) => {
		await loginPage.goto();
		const { serious } = await analyzeA11y(page);
		expect(serious.map((v) => v.id)).toEqual([]);
	});

	test("signup page has no serious violations", async ({ page, signupPage }) => {
		await signupPage.goto();
		const { serious } = await analyzeA11y(page);
		expect(serious.map((v) => v.id)).toEqual([]);
	});

	test("dashboard has no serious violations", async ({ page, dashboardPage }) => {
		await ensureAuthenticated(page, defaultUser);
		await dashboardPage.goto();
		const { serious } = await analyzeA11y(page);
		expect(serious.map((v) => v.id)).toEqual([]);
	});
});
