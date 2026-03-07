import Transactions from "@/pages/Transactions";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("Transactions Page", () => {
	it("should display transactions heading after loading", async () => {
		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		expect(await screen.findByTestId("transactions-heading", {}, { timeout: 5000 })).toBeInTheDocument();
		expect(screen.getByText("Transactions")).toBeInTheDocument();
	});

	it("should display add transaction button after loading", async () => {
		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		expect(await screen.findByTestId("add-transaction-button", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should display transactions datagrid after loading", async () => {
		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		expect(await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should show error state when API fails", async () => {
		// Override to return error response
		server.use(
			http.get("*/transactions", () => {
				return HttpResponse.json({ message: "Failed" }, { status: 500 });
			}),
		);

		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		// Wait for the error message to appear
		expect(await screen.findByText(/failed to load transactions/i, {}, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should open add transaction form when add button clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		const addButton = await screen.findByTestId("add-transaction-button", {}, { timeout: 5000 });
		await user.click(addButton);

		expect(await screen.findByRole("dialog", { name: /add transaction/i }, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should render edit and delete buttons for each transaction when data loaded", async () => {
		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 });
		const editButtons = screen.getAllByTestId("edit-transaction-button");
		expect(editButtons.length).toBeGreaterThan(0);
	});

	it("should open edit transaction form when edit button clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 });

		const editButtons = screen.getAllByTestId("edit-transaction-button");
		await user.click(editButtons[0]);

		expect(await screen.findByRole("dialog", { name: /edit transaction/i }, { timeout: 5000 })).toBeInTheDocument();
	});

	it("should open delete confirmation dialog when delete button clicked", async () => {
		const user = userEvent.setup();
		renderWithProviders(<Transactions />, { preloadState: authenticatedState });

		await screen.findByTestId("transactions-datagrid", {}, { timeout: 5000 });

		const deleteButtons = screen.getAllByTestId("delete-transaction-button");
		await user.click(deleteButtons[0]);

		expect(
			await screen.findByRole("dialog", { name: /delete transaction/i }, { timeout: 5000 }),
		).toBeInTheDocument();
	});
});
