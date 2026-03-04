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

	const results = await new AxeBuilder({ page })
		.withTags(tags)
		// https://github.com/GoogleChrome/lighthouse/blob/main/core/gather/gatherers/accessibility.js#L28-L86
		/* .withRules([
			"accesskeys",
			"area-alt",
			"aria-allowed-role",
			"aria-braille-equivalent",
			"aria-conditional-attr",
			"aria-deprecated-role",
			"aria-dialog-name",
			"aria-prohibited-attr",
			"aria-roledescription",
			"aria-treeitem-name",
			"aria-text",
			"audio-caption",
			"blink",
			"duplicate-id",
			"empty-heading",
			"frame-focusable-content",
			"frame-title-unique",
			"heading-order",
			"html-xml-lang-mismatch",
			"identical-links-same-purpose",
			"image-redundant-alt",
			"input-button-name",
			"label-content-name-mismatch",
			"landmark-one-main",
			"link-in-text-block",
			"marquee",
			"meta-viewport",
			"nested-interactive",
			"no-autoplay-audio",
			"role-img-alt",
			"scrollable-region-focusable",
			"select-name",
			"server-side-image-map",
			"skip-link",
			"summary-name",
			"svg-img-alt",
			"tabindex",
			"table-duplicate-name",
			"table-fake-caption",
			"target-size",
			"td-has-header",
		]) */
		.analyze();

	const serious = (results.violations as A11yViolation[]).filter(
		(v) => v.impact === "serious" || v.impact === "critical",
	);
	return { all: results.violations as A11yViolation[], serious };
}
