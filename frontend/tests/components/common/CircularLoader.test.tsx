import CircularLoader from "@/components/common/CircularLoader";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("CircularLoader", () => {
	it("should render CircularProgress component", () => {
		renderWithProviders(<CircularLoader />);
		const loader = screen.getByRole("progressbar");
		expect(loader).toBeInTheDocument();
	});

	it("should have correct aria-label for accessibility", () => {
		renderWithProviders(<CircularLoader />);
		const loader = screen.getByLabelText("Loading");
		expect(loader).toBeInTheDocument();
		expect(loader).toHaveAttribute("role", "progressbar");
	});
});
