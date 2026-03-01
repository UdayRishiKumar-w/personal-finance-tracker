import { expect, test } from "@playwright/test";
import { defaultUser, ensureAuthenticated } from "../../fixtures/auth";
import { mockTransactions } from "../../fixtures/routes";

test.describe("Dashboard responsiveness", () => {
	test("cards stack vertically on mobile viewport", async ({ page }) => {
		await ensureAuthenticated(page, defaultUser);
		await mockTransactions(page, []);
		await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12-ish
		await page.goto("/dashboard");

		const h0 = page.getByRole("heading", { name: /balance/i });
		const h1 = page.getByRole("heading", { name: /total income/i });
		const h2 = page.getByRole("heading", { name: /total expense/i });
		await expect(h0).toBeVisible();
		await expect(h1).toBeVisible();
		await expect(h2).toBeVisible();

		const [b0, b1, b2] = await Promise.all([
			page.getByLabel(/balance/i).boundingBox(),
			page.getByLabel(/total income/i).boundingBox(),
			page.getByLabel(/total expense/i).boundingBox(),
		]);
		expect(b0 && b1 && b2).toBeTruthy();
		// x positions should be reasonably close; y positions should be increasing
		expect(Math.abs((b0!.x ?? 0) - (b1!.x ?? 0))).toBeLessThan(50);
		expect(Math.abs((b1!.x ?? 0) - (b2!.x ?? 0))).toBeLessThan(50);
		expect(b0!.y ?? 0).toBeLessThan(b1!.y ?? 0);
		expect(b1!.y ?? 0).toBeLessThan(b2!.y ?? 0);
	});
});
