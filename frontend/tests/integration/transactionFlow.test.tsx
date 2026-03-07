import Transactions from "@/pages/Transactions";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("Transaction Flow Integration Tests", () => {
	const user = userEvent.setup();

	describe("Create Transaction Flow", () => {
		it("should open create transaction dialog when add button clicked", async () => {
			renderWithProviders(<Transactions />, { preloadState: authenticatedState });

			await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 });

			const addButton = screen.getByTestId("add-transaction-button");
			await user.click(addButton);

			expect(
				await screen.findByRole("dialog", { name: /add transaction/i }, { timeout: 5000 }),
			).toBeInTheDocument();
		});
	});

	describe("Edit Transaction Flow", () => {
		it("should open edit transaction dialog with data when edit button clicked", async () => {
			renderWithProviders(<Transactions />, { preloadState: authenticatedState });

			await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 });

			const editButtons = screen.getAllByTestId("edit-transaction-button");
			await user.click(editButtons[0]);

			expect(
				await screen.findByRole("dialog", { name: /edit transaction/i }, { timeout: 5000 }),
			).toBeInTheDocument();
		});
	});

	describe("Delete Transaction Flow", () => {
		it("should open delete confirmation dialog when delete button clicked", async () => {
			renderWithProviders(<Transactions />, { preloadState: authenticatedState });

			await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 });

			const deleteButtons = screen.getAllByTestId("delete-transaction-button");
			await user.click(deleteButtons[0]);

			expect(
				await screen.findByRole("dialog", { name: /delete transaction/i }, { timeout: 5000 }),
			).toBeInTheDocument();
		});

		it("should cancel delete and close dialog when cancel button clicked", async () => {
			renderWithProviders(<Transactions />, { preloadState: authenticatedState });

			await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 });

			const deleteButtons = screen.getAllByTestId("delete-transaction-button");
			await user.click(deleteButtons[0]);

			await screen.findByRole("dialog", { name: /delete transaction/i }, { timeout: 5000 });

			const cancelButton = screen.getByRole("button", { name: /cancel/i });
			await user.click(cancelButton);

			// Wait for dialog to close with animation
			await waitFor(
				() => {
					expect(screen.queryByRole("dialog", { name: /delete transaction/i })).not.toBeInTheDocument();
				},
				{ timeout: 5000 },
			);
		});
	});

	describe("Error Handling", () => {
		it("should handle API error gracefully when server fails", async () => {
			// Override to return error response
			server.use(
				http.get("*/transactions", () => {
					return HttpResponse.json({ message: "Failed to load" }, { status: 500 });
				}),
			);

			renderWithProviders(<Transactions />, { preloadState: authenticatedState });

			// Wait for the error message to appear (component handles error by showing error UI)
			expect(await screen.findByText(/failed to load transactions/i, {}, { timeout: 10000 })).toBeInTheDocument();
		});
	});
});
