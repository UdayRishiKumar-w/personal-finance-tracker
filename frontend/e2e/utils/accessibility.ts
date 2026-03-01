import { AxeBuilder } from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export type A11yViolation = {
	id: string;
	impact?: "minor" | "moderate" | "serious" | "critical";
	description: string;
	nodes: Array<{ html: string; target: string[] }>;
};

export async function analyzeA11y(page: Page, tags: string[] = ["wcag2a", "wcag2aa"]) {
	// Wait for the page to be stable and any animations to finish
	await page.waitForLoadState("load");
	await expect(page.locator("body")).toBeVisible();

	const results = await new AxeBuilder({ page }).withTags(tags).analyze();
	const serious = (results.violations as A11yViolation[]).filter(
		(v) => v.impact === "serious" || v.impact === "critical",
	);
	return { all: results.violations as A11yViolation[], serious };
}
