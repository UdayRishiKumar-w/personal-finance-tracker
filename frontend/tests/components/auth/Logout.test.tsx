import Logout from "@/components/auth/Logout";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("Logout", () => {
	it("should render logout button", () => {
		renderWithProviders(<Logout />, { preloadState: authenticatedState });
		expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
	});

	it("should have correct title attribute", () => {
		renderWithProviders(<Logout />, { preloadState: authenticatedState });
		const button = screen.getByRole("button", { name: /logout/i });
		expect(button).toHaveAttribute("title", "Logout");
	});

	it("should complete logout successfully on click", async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<Logout />, { preloadState: authenticatedState });

		await user.click(screen.getByRole("button", { name: /logout/i }));

		// Verify auth state is cleared after successful logout
		await waitFor(() => {
			expect(store.getState().auth.isAuthenticated).toBe(false);
		});
	});

	it("should show loading state during logout", async () => {
		const user = userEvent.setup();
		// Use a delayed response to reliably test loading state
		let resolveLogout: () => void;
		server.use(
			http.post("*/auth/logout", async () => {
				return new Promise((resolve) => {
					resolveLogout = () =>
						resolve(HttpResponse.json({ message: "Logged out successfully" }, { status: 200 }));
				});
			}),
		);

		renderWithProviders(<Logout />, { preloadState: authenticatedState });

		const button = screen.getByRole("button", { name: /logout/i });
		await user.click(button);

		// During logout, button should be disabled and show loading text
		await waitFor(() => {
			expect(button).toBeDisabled();
			expect(button).toHaveAttribute("title", "Logging out");
		});

		// Resolve the logout to complete the test
		resolveLogout!();

		await waitFor(() => {
			expect(button).not.toBeDisabled();
		});
	});

	it("should handle logout error gracefully", async () => {
		const user = userEvent.setup();
		server.use(
			http.post("*/auth/logout", () => {
				return HttpResponse.json({ message: "Logout failed" }, { status: 500 });
			}),
		);

		const { store } = renderWithProviders(<Logout />, { preloadState: authenticatedState });

		await user.click(screen.getByRole("button", { name: /logout/i }));

		// Verify error is dispatched to snackbar store
		await waitFor(() => {
			expect(store.getState().snackbar.message).toBe("Logout failed");
			expect(store.getState().snackbar.severity).toBe("error");
		});
	});

	it("should render button with accessible name", () => {
		renderWithProviders(<Logout />, { preloadState: authenticatedState });
		expect(screen.getByRole("button", { name: /logout/i })).toHaveAccessibleName("Logout");
	});
});
