import type { Page, Request } from "@playwright/test";
import type { PaginatedResponse, TransactionData } from "../../src/types/globalTypes";

const apiBasePattern = "**/api";

export type Paginated<T> = PaginatedResponse<T>;

export function buildPaginated<T>(content: T[], total?: number, page = 0): Paginated<T> {
	return {
		content,
		totalElements: total ?? content.length,
		totalPages: 1,
		size: content.length,
		page,
	};
}

export async function mockTransactions(page: Page, rows: TransactionData[] = []) {
	await page.route(new RegExp(`${apiBasePattern.replaceAll("**", ".*")}/transactions.*`), async (route, request) => {
		const url = new URL(request.url());
		const size = Number(url.searchParams.get("size") ?? 10);
		const pageIdx = Number(url.searchParams.get("page") ?? 0);

		const start = pageIdx * size;
		const end = start + size;
		const slice = rows.slice(start, end);

		const body = JSON.stringify(buildPaginated(slice, rows.length, pageIdx));
		await route.fulfill({ status: 200, contentType: "application/json", body });
	});
}

export async function mockCreateTransaction(page: Page, handler?: (payload: TransactionData) => TransactionData) {
	await page.route(`${apiBasePattern}/transactions`, async (route, request: Request) => {
		const payload = (await request.postDataJSON()) as TransactionData;
		const created: TransactionData = handler
			? handler(payload)
			: { ...payload, id: Math.floor(Math.random() * 10000) };
		await route.fulfill({
			status: 201,
			contentType: "application/json",
			body: JSON.stringify(created),
		});
	});
}

export async function mockUpdateTransaction(page: Page) {
	await page.route(`${apiBasePattern}/transactions/*`, async (route, request) => {
		if (request.method().toUpperCase() !== "PUT") return route.continue();
		const updated = (await request.postDataJSON()) as TransactionData;
		await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(updated) });
	});
}

export async function mockDeleteTransaction(page: Page) {
	await page.route(`${apiBasePattern}/transactions/*`, async (route, request) => {
		if (request.method().toUpperCase() !== "DELETE") return route.continue();
		await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({}) });
	});
}
