import type { Page } from "@playwright/test";

export type TestUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role?: "USER" | "ADMIN";
};

const apiBasePattern = "**/api";

export const defaultUser: TestUser = {
	id: 1,
	firstName: "Test",
	lastName: "User",
	email: "test.user@example.com",
	role: "USER",
};

export async function mockLoginSuccess(page: Page, user: TestUser = defaultUser) {
	await page.route(`${apiBasePattern}/auth/login`, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ user }),
		});
	});
}

export async function mockLoginFailure(page: Page, message = "Invalid credentials", status = 401) {
	await page.route(`${apiBasePattern}/auth/login`, async (route) => {
		await route.fulfill({
			status,
			contentType: "application/json",
			body: JSON.stringify({ message }),
		});
	});
}

export async function mockSignupSuccess(page: Page, user: TestUser = defaultUser) {
	await page.route(`${apiBasePattern}/auth/signup`, async (route) => {
		await route.fulfill({
			status: 201,
			contentType: "application/json",
			body: JSON.stringify({ user }),
		});
	});
}

export async function mockSignupFailure(page: Page, message = "Signup failed", status = 400) {
	await page.route(`${apiBasePattern}/auth/signup`, async (route) => {
		await route.fulfill({
			status,
			contentType: "application/json",
			body: JSON.stringify({ message }),
		});
	});
}

export async function mockLogout(page: Page) {
	await page.route(`${apiBasePattern}/auth/logout`, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ message: "Logged out" }),
		});
	});
}

export async function mockMe(page: Page, user: TestUser = defaultUser) {
	await page.route(`${apiBasePattern}/auth/me`, async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ user }),
		});
	});
}

export async function ensureAuthenticated(page: Page, user: TestUser = defaultUser) {
	await page.addInitScript(() => {
		try {
			localStorage.setItem("isLoggedIn", "true");
			localStorage.setItem(
				"user",
				JSON.stringify({
					id: 1,
					firstName: "Test",
					lastName: "User",
					email: "test.user@example.com",
					role: "USER",
				}),
			);
		} catch {
			// ignore
		}
	});
	await mockMe(page, user);
}
