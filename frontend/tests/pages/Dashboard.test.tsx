import Dashboard from "@/pages/Dashboard";
import { screen } from "@testing-library/react";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("Dashboard Page", () => {
	it("should display dashboard content after loading", async () => {
		renderWithProviders(<Dashboard />, { preloadState: authenticatedState });

		expect(await screen.findByText("Dashboard")).toBeInTheDocument();
	});

	it("should display balance card after loading", async () => {
		renderWithProviders(<Dashboard />, { preloadState: authenticatedState });

		expect(await screen.findByTestId("balance-card")).toBeInTheDocument();
	});

	it("should display income card after loading", async () => {
		renderWithProviders(<Dashboard />, { preloadState: authenticatedState });

		const incomeCard = await screen.findByTestId("income-card");
		expect(incomeCard).toBeInTheDocument();
		expect(screen.getByLabelText("Total Income")).toBeInTheDocument();
	});

	it("should display expense card after loading", async () => {
		renderWithProviders(<Dashboard />, { preloadState: authenticatedState });

		const expenseCard = await screen.findByTestId("expense-card");
		expect(expenseCard).toBeInTheDocument();
		expect(screen.getByLabelText("Total Expense")).toBeInTheDocument();
	});

	it("should display recent transactions card after loading", async () => {
		renderWithProviders(<Dashboard />, { preloadState: authenticatedState });

		expect(await screen.findByTestId("recent-transactions-card")).toBeInTheDocument();
	});

	it("should show error state on API failure", async () => {
		server.use(
			http.get("*/transactions", () => {
				return HttpResponse.json({ message: "Failed" }, { status: 500 });
			}),
		);

		renderWithProviders(<Dashboard />, { preloadState: authenticatedState });

		expect(await screen.findByRole("alert")).toBeInTheDocument();
	});

	it("should handle empty transactions", async () => {
		server.use(
			http.get("*/transactions", () => {
				return HttpResponse.json({
					content: [],
					totalElements: 0,
					totalPages: 0,
					page: 0,
					size: 10,
				});
			}),
		);

		renderWithProviders(<Dashboard />, { preloadState: authenticatedState });

		expect(await screen.findByText(/No recent transactions/i)).toBeInTheDocument();
	});
});
