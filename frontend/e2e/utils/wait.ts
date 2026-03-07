import type { Locator } from "@playwright/test";

export async function waitForAnimations(locator: Locator): Promise<void> {
	await locator.evaluate(async (el) => {
		const animations = el.getAnimations();
		await Promise.all(animations.map((animation) => animation.finished));
	});
}
