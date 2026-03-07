import useGetDateFnsLocale from "@/hooks/useGetDateFnsLocale";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/utils";
import { format } from "date-fns";
import { describe, expect, it } from "vitest";

// Test component that uses the hook
const TestComponent = () => {
	const locale = useGetDateFnsLocale();
	const testDate = new Date(2024, 0, 15); // January 15, 2024
	const formattedDate = format(testDate, "MMMM", { locale });
	return (
		<div>
			<p>Locale: {locale.code}</p>
			<p>Month: {formattedDate}</p>
		</div>
	);
};

describe("useGetDateFnsLocale", () => {
	it("should return English locale by default", () => {
		renderWithProviders(<TestComponent />);
		expect(screen.getByText(/Locale: en-US/i)).toBeInTheDocument();
	});

	it("should format dates correctly with English locale", () => {
		renderWithProviders(<TestComponent />);
		expect(screen.getByText(/Month: January/i)).toBeInTheDocument();
	});

	it("should return a valid locale object", () => {
		renderWithProviders(<TestComponent />);
		// Verify locale code is displayed
		expect(screen.getByText(/Locale:/i)).toBeInTheDocument();
	});
});
