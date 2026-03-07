import BalanceChart from "@/components/charts/BalanceChart";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

// Note: react-chartjs-2 is mocked globally in tests/setup.ts

describe("BalanceChart", () => {
	it("should render the chart with accessible label", () => {
		renderWithProviders(<BalanceChart />);
		// Chart should render with a mock canvas
		expect(screen.getByRole("img", { name: /line chart/i })).toBeInTheDocument();
	});

	it("should render canvas element for Chart.js", () => {
		renderWithProviders(<BalanceChart />);
		// Canvas should be present for chart rendering
		expect(screen.getByRole("img", { name: /line chart/i })).toBeInTheDocument();
	});
});
