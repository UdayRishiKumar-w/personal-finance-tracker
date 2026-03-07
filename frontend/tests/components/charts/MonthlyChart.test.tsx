import MonthlyChart from "@/components/charts/MonthlyChart";
import { screen } from "@testing-library/react";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("MonthlyChart", () => {
	it("should render the chart with accessible label", async () => {
		renderWithProviders(<MonthlyChart />, { preloadState: authenticatedState });
		expect(await screen.findByLabelText("Income vs Expense chart")).toBeInTheDocument();
	});

	it("should render with default months prop (6)", async () => {
		renderWithProviders(<MonthlyChart />, { preloadState: authenticatedState });
		expect(await screen.findByLabelText("Income vs Expense chart")).toBeInTheDocument();
	});

	it("should render with custom months prop", async () => {
		renderWithProviders(<MonthlyChart months={12} />, {
			preloadState: authenticatedState,
		});
		expect(await screen.findByLabelText("Income vs Expense chart")).toBeInTheDocument();
	});
});
