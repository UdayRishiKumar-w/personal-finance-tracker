import Logout from "@/components/auth/Logout";
import PrivateRoute from "@/components/common/PrivateRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("Authentication Flow Integration Tests", () => {
	const user = userEvent.setup();

	describe("Login Flow", () => {
		it("should complete full login flow and update auth state when form submitted", async () => {
			const { store } = renderWithProviders(<Login />);

			// Fill in login form
			const emailInput = screen.getByTestId("login-email-input");
			const passwordInput = screen.getByTestId("login-password-input");
			const submitButton = screen.getByTestId("login-submit-button");

			await user.type(emailInput, "test@example.com");
			await user.type(passwordInput, "Password123!");
			await user.click(submitButton);

			// Verify authentication state is updated
			await waitFor(
				() => {
					expect(store.getState().auth.isAuthenticated).toBe(true);
					expect(store.getState().auth.user).not.toBeNull();
				},
				{ timeout: 5000 },
			);
		});

		it("should show error snackbar when invalid credentials provided", async () => {
			const { store } = renderWithProviders(<Login />);

			const emailInput = screen.getByTestId("login-email-input");
			const passwordInput = screen.getByTestId("login-password-input");
			const submitButton = screen.getByTestId("login-submit-button");

			await user.type(emailInput, "invalid@example.com");
			await user.type(passwordInput, "wrongpassword");
			await user.click(submitButton);

			// Verify error is dispatched to snackbar store
			await waitFor(
				() => {
					expect(store.getState().snackbar.message).toBe("Invalid email or password");
					expect(store.getState().snackbar.severity).toBe("error");
				},
				{ timeout: 5000 },
			);
		});
	});

	describe("Signup Flow", () => {
		it("should complete full signup flow and update auth state when form submitted", async () => {
			const { store } = renderWithProviders(<Signup />);

			const firstNameInput = screen.getByTestId("signup-firstName-input");
			const lastNameInput = screen.getByTestId("signup-lastName-input");
			const emailInput = screen.getByTestId("signup-email-input");
			const passwordInput = screen.getByTestId("signup-password-input");
			const submitButton = screen.getByTestId("signup-submit-button");

			await user.type(firstNameInput, "John");
			await user.type(lastNameInput, "Doe");
			await user.type(emailInput, "newuser@example.com");
			await user.type(passwordInput, "ValidPass123!");
			await user.click(submitButton);

			await waitFor(
				() => {
					expect(store.getState().auth.isAuthenticated).toBe(true);
				},
				{ timeout: 5000 },
			);
		});
	});

	describe("Logout Flow", () => {
		it("should complete full logout flow and clear state when button clicked", async () => {
			const { store } = renderWithProviders(<Logout />, { preloadState: authenticatedState });

			const logoutButton = screen.getByRole("button");
			await user.click(logoutButton);

			await waitFor(
				() => {
					expect(store.getState().auth.isAuthenticated).toBe(false);
					expect(store.getState().auth.user).toBeNull();
				},
				{ timeout: 5000 },
			);
		});

		it("should handle logout error gracefully when API fails", async () => {
			server.use(
				http.post("*/auth/logout", () => {
					return HttpResponse.json({ message: "Logout failed" }, { status: 500 });
				}),
			);

			const { store } = renderWithProviders(<Logout />, { preloadState: authenticatedState });

			const logoutButton = screen.getByRole("button");
			await user.click(logoutButton);

			// Verify error is dispatched to snackbar store
			await waitFor(
				() => {
					expect(store.getState().snackbar.message).toBe("Logout failed");
					expect(store.getState().snackbar.severity).toBe("error");
				},
				{ timeout: 5000 },
			);
		});
	});

	describe("Protected Route Access", () => {
		it("should redirect to login when accessing protected route unauthenticated", () => {
			renderWithProviders(
				<PrivateRoute>
					<div data-testid="protected">Protected Content</div>
				</PrivateRoute>,
				{ route: "/dashboard" },
			);

			// Should not show protected content
			expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
		});

		it("should show protected content when user is authenticated", () => {
			renderWithProviders(
				<PrivateRoute>
					<div data-testid="protected">Protected Content</div>
				</PrivateRoute>,
				{ preloadState: authenticatedState },
			);

			expect(screen.getByTestId("protected")).toBeInTheDocument();
		});
	});
});
