import TransactionForm from "@/components/forms/TransactionForm";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders, runAxe } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

describe("TransactionForm", () => {
	const defaultProps = {
		open: true,
		onClose: vi.fn(),
		editTransaction: null,
	};

	it("should have no accessibility violations", async () => {
		const { container } = renderWithProviders(<TransactionForm {...defaultProps} />, {
			preloadState: authenticatedState,
		});
		expect(await runAxe(container)).toHaveNoViolations();
	});

	it("should render add form dialog when open", async () => {
		renderWithProviders(<TransactionForm {...defaultProps} />, { preloadState: authenticatedState });
		expect(await screen.findByRole("dialog", { name: /add transaction/i })).toBeInTheDocument();
	});

	it("should render edit form dialog with transaction data", async () => {
		const editTransaction = {
			id: 1,
			title: "Grocery",
			amount: 100,
			category: "Food",
			type: "EXPENSE" as const,
			date: "2024-01-15",
			description: "Weekly groceries",
			recurring: false,
		};

		renderWithProviders(<TransactionForm {...defaultProps} editTransaction={editTransaction} />, {
			preloadState: authenticatedState,
		});
		expect(await screen.findByRole("dialog", { name: /edit transaction/i })).toBeInTheDocument();
		expect(screen.getByDisplayValue("Grocery")).toBeInTheDocument();
	});

	it("should not render when closed", () => {
		renderWithProviders(<TransactionForm {...defaultProps} open={false} />, {
			preloadState: authenticatedState,
		});
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("should have all required form fields", async () => {
		renderWithProviders(<TransactionForm {...defaultProps} />, { preloadState: authenticatedState });
		await screen.findByRole("dialog");

		expect(screen.getByRole("textbox", { name: /title/i })).toBeInTheDocument();
		expect(screen.getByRole("combobox", { name: /type/i })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: /category/i })).toBeInTheDocument();
		expect(screen.getByRole("spinbutton", { name: /amount/i })).toBeInTheDocument();
	});

	it("should have cancel and submit buttons", async () => {
		renderWithProviders(<TransactionForm {...defaultProps} />, { preloadState: authenticatedState });
		await screen.findByRole("dialog");

		expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
	});

	it("should call onClose when cancel is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		renderWithProviders(<TransactionForm {...defaultProps} onClose={onClose} />, {
			preloadState: authenticatedState,
		});
		await screen.findByRole("dialog");

		await user.click(screen.getByRole("button", { name: /cancel/i }));

		expect(onClose).toHaveBeenCalled();
	});

	it("should show validation error for required fields", async () => {
		const user = userEvent.setup();
		renderWithProviders(<TransactionForm {...defaultProps} />, { preloadState: authenticatedState });
		await screen.findByRole("dialog");

		await user.click(screen.getByRole("button", { name: /add/i }));

		expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
	});

	it("should validate amount must be positive", async () => {
		const user = userEvent.setup();
		renderWithProviders(<TransactionForm {...defaultProps} />, { preloadState: authenticatedState });
		await screen.findByRole("dialog");

		const amountInput = screen.getByRole("spinbutton", { name: /amount/i });
		await user.clear(amountInput);
		await user.type(amountInput, "-10");
		await user.click(screen.getByRole("button", { name: /add/i }));

		expect(await screen.findByText(/amount must be positive/i)).toBeInTheDocument();
	});

	it("should submit form with valid data", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		renderWithProviders(<TransactionForm {...defaultProps} onClose={onClose} />, {
			preloadState: authenticatedState,
		});
		await screen.findByRole("dialog");

		await user.type(screen.getByRole("textbox", { name: /title/i }), "Test Transaction");
		await user.type(screen.getByRole("textbox", { name: /category/i }), "Test Category");

		const amountInput = screen.getByRole("spinbutton", { name: /amount/i });
		await user.clear(amountInput);
		await user.type(amountInput, "100");

		await user.click(screen.getByRole("button", { name: /add/i }));

		await waitFor(() => {
			expect(onClose).toHaveBeenCalled();
		});
	});

	it("should handle submission error", async () => {
		const user = userEvent.setup();
		server.use(
			http.post("*/transactions", () => {
				return HttpResponse.json({ message: "Validation error" }, { status: 400 });
			}),
		);

		const { store } = renderWithProviders(<TransactionForm {...defaultProps} />, {
			preloadState: authenticatedState,
		});
		await screen.findByRole("dialog");

		await user.type(screen.getByRole("textbox", { name: /title/i }), "Test");
		await user.type(screen.getByRole("textbox", { name: /category/i }), "Test");

		const amountInput = screen.getByRole("spinbutton", { name: /amount/i });
		await user.clear(amountInput);
		await user.type(amountInput, "100");

		await user.click(screen.getByRole("button", { name: /add/i }));

		await waitFor(() => {
			expect(store.getState().snackbar.message).toBe("Validation error");
		});
	});
});
