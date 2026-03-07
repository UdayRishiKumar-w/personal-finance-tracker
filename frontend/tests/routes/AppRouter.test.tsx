import AppRouter from "@/routes/AppRouter";
import { screen } from "@testing-library/react";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("AppRouter", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("should redirect to dashboard when authenticated and visiting login", async () => {
		renderWithProviders(<AppRouter />, {
			preloadState: authenticatedState,
			route: "/login",
		});

		expect(await screen.findByText("Dashboard", {}, { timeout: 25000 })).toBeInTheDocument();
	});

	it("should redirect to dashboard when authenticated and visiting signup", async () => {
		renderWithProviders(<AppRouter />, {
			preloadState: authenticatedState,
			route: "/signup",
		});

		expect(await screen.findByText("Dashboard", {}, { timeout: 10000 })).toBeInTheDocument();
	});

	it("should render login page when not authenticated and visiting /login", async () => {
		renderWithProviders(<AppRouter />, { route: "/login" });

		expect(await screen.findByRole("heading", { name: /login/i }, { timeout: 10000 })).toBeInTheDocument();
	});

	it("should render signup page when not authenticated and visiting /signup", async () => {
		renderWithProviders(<AppRouter />, { route: "/signup" });

		expect(await screen.findByRole("heading", { name: /sign up/i }, { timeout: 10000 })).toBeInTheDocument();
	});

	it("should redirect root to dashboard when authenticated", async () => {
		renderWithProviders(<AppRouter />, {
			preloadState: authenticatedState,
			route: "/",
		});

		expect(await screen.findByText("Dashboard", {}, { timeout: 10000 })).toBeInTheDocument();
	});

	it("should render dashboard when authenticated", async () => {
		renderWithProviders(<AppRouter />, {
			preloadState: authenticatedState,
			route: "/dashboard",
		});

		expect(await screen.findByText("Dashboard", {}, { timeout: 10000 })).toBeInTheDocument();
	});

	it("should render transactions page when authenticated", async () => {
		renderWithProviders(<AppRouter />, {
			preloadState: authenticatedState,
			route: "/transactions",
		});

		expect(await screen.findByTestId("transactions-heading", {}, { timeout: 20000 })).toBeInTheDocument();
	});

	it("should render not found page for unknown routes", async () => {
		renderWithProviders(<AppRouter />, {
			preloadState: authenticatedState,
			route: "/unknown-route",
		});

		expect(await screen.findByText(/404|not found/i, {}, { timeout: 10000 })).toBeInTheDocument();
	});

	it("should handle auth check failure gracefully", async () => {
		// Set isLoggedIn to trigger auth check, but API returns error
		localStorage.setItem("isLoggedIn", "true");
		server.use(
			http.get("*/auth/me", () => {
				return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
			}),
		);

		renderWithProviders(<AppRouter />, { route: "/" });

		// Should eventually show login page after failed auth check
		expect(await screen.findByRole("heading", { name: /login/i }, { timeout: 10000 })).toBeInTheDocument();
	});
});
