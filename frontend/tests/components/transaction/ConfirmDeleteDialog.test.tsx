import ConfirmDeleteDialog from "@/components/transaction/ConfirmDeleteDialog";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

describe("ConfirmDeleteDialog", () => {
	const defaultProps = {
		open: true,
		onClose: vi.fn(),
		deleteId: 1,
	};

	it("should render when open", () => {
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, { preloadState: authenticatedState });
		expect(screen.getByText("Delete Transaction")).toBeInTheDocument();
	});

	it("should not render when closed", () => {
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} open={false} />, {
			preloadState: authenticatedState,
		});
		expect(screen.queryByText("Delete Transaction")).not.toBeInTheDocument();
	});

	it("should display warning message", () => {
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, { preloadState: authenticatedState });
		expect(screen.getByText(/Do you really want to delete this transaction/i)).toBeInTheDocument();
		expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument();
	});

	it("should have cancel button", () => {
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, { preloadState: authenticatedState });
		expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
	});

	it("should have delete button", () => {
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, { preloadState: authenticatedState });
		expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
	});

	it("should call onClose when cancel is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} onClose={onClose} />, {
			preloadState: authenticatedState,
		});

		await user.click(screen.getByRole("button", { name: /cancel/i }));

		expect(onClose).toHaveBeenCalled();
	});

	it("should call delete mutation when delete is clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, { preloadState: authenticatedState });

		await user.click(screen.getByRole("button", { name: /delete/i }));

		expect(await screen.findByRole("button", { name: /deleting/i })).toBeInTheDocument();
	});

	it("should show deleting state during deletion", async () => {
		const user = userEvent.setup();
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, { preloadState: authenticatedState });

		await user.click(screen.getByRole("button", { name: /delete/i }));

		expect(await screen.findByText("Deleting...")).toBeInTheDocument();
	});

	it("should disable buttons during deletion", async () => {
		const user = userEvent.setup();
		renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, { preloadState: authenticatedState });

		const deleteButton = screen.getByRole("button", { name: /delete/i });
		await user.click(deleteButton);

		await waitFor(() => {
			expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
			expect(deleteButton).toBeDisabled();
		});
	});

	it("should handle delete error gracefully", async () => {
		const user = userEvent.setup();
		// Override handler to return error
		server.use(
			http.delete("*/transactions/:id", () => {
				return HttpResponse.json({ message: "Delete failed" }, { status: 500 });
			}),
		);

		const { store } = renderWithProviders(<ConfirmDeleteDialog {...defaultProps} />, {
			preloadState: authenticatedState,
		});

		await user.click(screen.getByRole("button", { name: /delete/i }));

		await waitFor(() => {
			expect(store.getState().snackbar.message).toBe("Delete failed");
		});
	});

	it("should handle missing deleteId", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		const { store } = renderWithProviders(
			<ConfirmDeleteDialog {...defaultProps} deleteId={null} onClose={onClose} />,
			{
				preloadState: authenticatedState,
			},
		);

		await user.click(screen.getByRole("button", { name: /delete/i }));

		await waitFor(() => {
			expect(store.getState().snackbar.message).toBe("Cannot delete transaction without valid ID");
		});
	});
});
