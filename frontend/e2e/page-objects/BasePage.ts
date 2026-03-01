import { expect, type Locator, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

export class BasePage {
	protected readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async navigateTo(path: string) {
		await this.page.goto(path);
	}

	async waitForURL(pattern: string | RegExp) {
		await this.page.waitForURL(pattern);
	}

	getSnackbar() {
		return this.page.getByRole("alert");
	}

	async waitForStable(locator: Locator) {
		await expect(locator).toBeVisible();
		// Instead of manual stabilization, Playwright's default behavior is often enough.
		// If we really need to wait for stability, we can wait for animations to finish.
		await locator.evaluate(async (el) => {
			const animations = el.getAnimations();
			await Promise.all(animations.map((animation) => animation.finished));
		});
		// Sometimes a short wait is still needed for layout stability
		await this.pause(100);
	}

	async clickElement(locator: Locator) {
		await locator.scrollIntoViewIfNeeded();
		await locator.click();
	}

	async fillInput(locator: Locator, value: string) {
		await locator.scrollIntoViewIfNeeded();
		await locator.clear();
		await locator.fill(value);
	}

	async isVisible(locator: Locator) {
		return await locator.isVisible();
	}

	async getTitle() {
		return await this.page.title();
	}

	async pause(ms: number) {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}

	async takeScreenshot(name: string) {
		const screenshotDir = "e2e/screenshots";
		if (!fs.existsSync(screenshotDir)) {
			fs.mkdirSync(screenshotDir, { recursive: true });
		}
		await this.page.screenshot({ path: path.join(screenshotDir, `${name}.png`), fullPage: true });
	}
}
