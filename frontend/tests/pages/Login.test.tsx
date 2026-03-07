import Login from "@/pages/Login";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("Login Page", () => {
	it("should render login form with email and password fields", () => {
		renderWithProviders(<Login />);
		expect(screen.getByTestId("login-form")).toBeInTheDocument();
		expect(screen.getByTestId("login-email-input")).toBeInTheDocument();
		expect(screen.getByTestId("login-password-input")).toBeInTheDocument();
	});

	it("should render login button and signup link", () => {
		renderWithProviders(<Login />);
		expect(screen.getByTestId("login-submit-button")).toBeInTheDocument();
		expect(screen.getByTestId("goto-signup-link")).toBeInTheDocument();
	});

	it("should toggle password visibility", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		const passwordInput = screen.getByTestId("login-password-input");
		expect(passwordInput).toHaveAttribute("type", "password");

		const toggleButton = screen.getByTestId("toggle-password-visibility");
		await user.click(toggleButton);
		expect(passwordInput).toHaveAttribute("type", "text");

		await user.click(toggleButton);
		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("should validate email format", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		const emailInput = screen.getByTestId("login-email-input");
		await user.type(emailInput, "invalid-email");
		await user.tab();

		expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
	});

	it("should validate password is required", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Login />);

		const passwordInput = screen.getByTestId("login-password-input");
		await user.type(passwordInput, " ");
		await user.clear(passwordInput);
		await user.tab();

		expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
	});

	it("should complete login successfully with valid credentials", async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<Login />);

		await user.type(screen.getByTestId("login-email-input"), "test@example.com");
		await user.type(screen.getByTestId("login-password-input"), "Password123!");
		await user.click(screen.getByTestId("login-submit-button"));

		await waitFor(() => {
			expect(store.getState().auth.isAuthenticated).toBe(true);
		});
	});

	it("should show error on failed login", async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<Login />);

		await user.type(screen.getByTestId("login-email-input"), "invalid@example.com");
		await user.type(screen.getByTestId("login-password-input"), "wrongpassword");
		await user.click(screen.getByTestId("login-submit-button"));

		await waitFor(() => {
			expect(store.getState().snackbar.message).toBe("Invalid email or password");
		});
	});
});
