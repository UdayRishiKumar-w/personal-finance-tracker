import Loader from "@/components/common/Loader";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("Loader", () => {
	it("should render with default text when no text prop provided", () => {
		renderWithProviders(<Loader />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("should render with custom text when text prop provided", () => {
		renderWithProviders(<Loader text="Please wait..." />);
		expect(screen.getByText("Please wait...")).toBeInTheDocument();
	});

	it("should render loading status for accessibility", () => {
		renderWithProviders(<Loader text="Processing..." />);
		expect(screen.getByText("Processing...")).toBeInTheDocument();
	});
});
