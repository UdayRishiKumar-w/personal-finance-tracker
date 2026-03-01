import { expect, test } from "@playwright/test";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";

test.describe("PWA", () => {
	test("manifest present and SW API available", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await page.goto("/dashboard");
		const hasManifest = await page.evaluate(() => !!document.querySelector('link[rel="manifest"]'));
		expect(hasManifest).toBeTruthy();
		const hasSWApi = await page.evaluate(() => "serviceWorker" in navigator);
		expect(hasSWApi).toBeTruthy();
	});
});
