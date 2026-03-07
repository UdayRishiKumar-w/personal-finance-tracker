import Signup from "@/pages/Signup";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("Signup Page", () => {
	it("should render signup form with all input fields", async () => {
		renderWithProviders(<Signup />);
		expect(await screen.findByTestId("signup-form")).toBeInTheDocument();
		expect(screen.getByTestId("signup-firstName-input")).toBeInTheDocument();
		expect(screen.getByTestId("signup-lastName-input")).toBeInTheDocument();
		expect(screen.getByTestId("signup-email-input")).toBeInTheDocument();
		expect(screen.getByTestId("signup-password-input")).toBeInTheDocument();
	});

	it("should render signup button and login link", async () => {
		renderWithProviders(<Signup />);
		expect(await screen.findByTestId("signup-submit-button")).toBeInTheDocument();
		expect(screen.getByTestId("goto-login-link")).toBeInTheDocument();
	});

	it("should toggle password visibility", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Signup />);

		const passwordInput = await screen.findByTestId("signup-password-input");
		expect(passwordInput).toHaveAttribute("type", "password");

		const toggleButton = screen.getByTestId("toggle-password-visibility");
		await user.click(toggleButton);
		expect(passwordInput).toHaveAttribute("type", "text");
	});

	it("should validate first name is required", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Signup />);

		const firstNameInput = await screen.findByTestId("signup-firstName-input");
		await user.type(firstNameInput, " ");
		await user.clear(firstNameInput);
		await user.tab();

		expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
	});

	it("should validate last name is required", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Signup />);

		const lastNameInput = await screen.findByTestId("signup-lastName-input");
		await user.type(lastNameInput, " ");
		await user.clear(lastNameInput);
		await user.tab();

		expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
	});

	it("should validate email format", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Signup />);

		const emailInput = await screen.findByTestId("signup-email-input");
		await user.type(emailInput, "invalid-email");
		await user.tab();

		expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
	});

	it("should validate password minimum length", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Signup />);

		const passwordInput = await screen.findByTestId("signup-password-input");
		await user.type(passwordInput, "short");
		await user.tab();

		expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument();
	});

	it("should validate password complexity", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Signup />);

		const passwordInput = await screen.findByTestId("signup-password-input");
		await user.type(passwordInput, "simplepassword");
		await user.tab();

		expect(await screen.findByText(/uppercase, lowercase, number, and special character/i)).toBeInTheDocument();
	});

	it("should complete signup successfully with valid data", async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<Signup />);

		await user.type(await screen.findByTestId("signup-firstName-input"), "John");
		await user.type(screen.getByTestId("signup-lastName-input"), "Doe");
		await user.type(screen.getByTestId("signup-email-input"), "newuser@example.com");
		await user.type(screen.getByTestId("signup-password-input"), "ValidPass123!");
		await user.click(screen.getByTestId("signup-submit-button"));

		await waitFor(() => {
			expect(store.getState().auth.isAuthenticated).toBe(true);
		});
	});

	it("should show error on email already exists", async () => {
		const user = userEvent.setup();
		const { store } = renderWithProviders(<Signup />);

		await user.type(await screen.findByTestId("signup-firstName-input"), "John");
		await user.type(screen.getByTestId("signup-lastName-input"), "Doe");
		await user.type(screen.getByTestId("signup-email-input"), "existing@example.com");
		await user.type(screen.getByTestId("signup-password-input"), "ValidPass123!");
		await user.click(screen.getByTestId("signup-submit-button"));

		await waitFor(() => {
			expect(store.getState().snackbar.message).toBe("Email already registered");
		});
	});
});
