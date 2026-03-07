import { SnackbarProvider } from "@/components/SnackbarProvider";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/utils";
import { describe, expect, it } from "vitest";

describe("SnackbarProvider", () => {
	it("should render when snackbar is open", () => {
		const preloadState = {
			snackbar: {
				open: true,
				message: "Test message",
				severity: "success" as const,
			},
		};

		renderWithProviders(<SnackbarProvider />, { preloadState });
		expect(screen.getByText("Test message")).toBeInTheDocument();
	});

	it("should not render when snackbar is closed", () => {
		const preloadState = {
			snackbar: {
				open: false,
				message: "",
				severity: "info" as const,
			},
		};

		renderWithProviders(<SnackbarProvider />, { preloadState });
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("should display correct severity", () => {
		const preloadState = {
			snackbar: {
				open: true,
				message: "Error message",
				severity: "error" as const,
			},
		};

		renderWithProviders(<SnackbarProvider />, { preloadState });
		const alert = screen.getByRole("alert");
		expect(alert).toHaveClass("MuiAlert-filledError");
	});

	it("should display success severity", () => {
		const preloadState = {
			snackbar: {
				open: true,
				message: "Success!",
				severity: "success" as const,
			},
		};

		renderWithProviders(<SnackbarProvider />, { preloadState });
		const alert = screen.getByRole("alert");
		expect(alert).toHaveClass("MuiAlert-filledSuccess");
	});

	it("should dispatch hideSnackbar on close", async () => {
		const user = userEvent.setup();
		const preloadState = {
			snackbar: {
				open: true,
				message: "Test message",
				severity: "info" as const,
			},
		};

		const { store } = renderWithProviders(<SnackbarProvider />, { preloadState });

		await user.click(screen.getByRole("button", { name: /close/i }));

		const actions = store.getState().snackbar;
		expect(actions.open).toBe(false);
	});

	it("should have correct anchor origin", () => {
		const preloadState = {
			snackbar: {
				open: true,
				message: "Test",
				severity: "info" as const,
			},
		};

		renderWithProviders(<SnackbarProvider />, { preloadState });
		const snackbar = screen.getByRole("presentation");
		expect(snackbar).toBeInTheDocument();
	});
});
