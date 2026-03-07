import Layout from "@/layouts/Layout";
import { screen } from "@testing-library/react";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("Layout", () => {
	it("should render children inside layout when provided", async () => {
		renderWithProviders(
			<Layout>
				<div data-testid="child-content">Test Content</div>
			</Layout>,
			{ preloadState: authenticatedState },
		);

		// Wait for the health check and content to render
		expect(await screen.findByTestId("child-content", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should render NavBar component when layout is mounted", async () => {
		renderWithProviders(
			<Layout>
				<div>Content</div>
			</Layout>,
			{ preloadState: authenticatedState },
		);

		// NavBar should be present
		expect(await screen.findByRole("banner", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should have main content area for children", async () => {
		renderWithProviders(
			<Layout>
				<div data-testid="test-child">Child</div>
			</Layout>,
			{ preloadState: authenticatedState },
		);

		const main = await screen.findByRole("main", {}, { timeout: 5000 });
		expect(main).toBeInTheDocument();
	});
});
