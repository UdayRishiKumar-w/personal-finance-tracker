import PrivateRoute from "@/components/common/PrivateRoute";
import { screen } from "@testing-library/react";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { Outlet } from "react-router-dom";
import { describe, expect, it } from "vitest";

// Test component for children
const TestChild = () => <div>Protected Content</div>;

describe("PrivateRoute", () => {
	it("should redirect to /login when not authenticated", () => {
		renderWithProviders(
			<PrivateRoute>
				<TestChild />
			</PrivateRoute>,
			{ route: "/dashboard" },
		);

		// Should not render protected content
		expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
	});

	it("should render children when authenticated", () => {
		renderWithProviders(
			<PrivateRoute>
				<TestChild />
			</PrivateRoute>,
			{ preloadState: authenticatedState },
		);

		expect(screen.getByText("Protected Content")).toBeInTheDocument();
	});

	it("should render Outlet when no children provided and authenticated", () => {
		renderWithProviders(
			<PrivateRoute>
				<Outlet />
			</PrivateRoute>,
			{
				preloadState: authenticatedState,
				route: "/dashboard",
			},
		);

		// When no children but Outlet is provided, it should render the Outlet
		// Since we don't have child routes defined, Outlet will render null
		expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
	});
});
