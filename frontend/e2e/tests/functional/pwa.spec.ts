import { expect, test } from "@playwright/test";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";

test.describe("PWA", () => {
	test("manifest present and SW API available", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await page.goto("/dashboard");
		const hasManifest = await page.evaluate(() => !!document.querySelector('link[rel="manifest"]'));
		expect(hasManifest).toBeTruthy();
		const swRegistration = await page.evaluate(async () => {
			if (!("serviceWorker" in navigator)) return null;
			const registration = await navigator.serviceWorker.getRegistration();
			return registration ? { active: !!registration.active } : null;
		});
		expect(swRegistration).not.toBeNull();
		expect(swRegistration?.active).toBe(true);
	});
});
