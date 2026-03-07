import {
	useCreateTransaction,
	useDeleteTransaction,
	useTransactions,
	useTransactionsRange,
	useUpdateTransaction,
} from "@/api/transactionsApi";
import type { TransactionData } from "@/types/globalTypes";
import { screen, waitFor } from "@testing-library/react";
import { server } from "@tests/mocks/server";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { http, HttpResponse } from "msw";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";

// Test component that uses the transactions hook
const TestTransactionsComponent = ({ page = 0, size = 10 }: { page?: number; size?: number }) => {
	const { data, isLoading, isError, error } = useTransactions(page, size);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return (
		<div>
			<div data-testid="total">{data?.totalElements}</div>
			<div data-testid="transactions">{data?.content?.length}</div>
		</div>
	);
};

const TestCreateTransactionComponent = ({ payload }: { payload: TransactionData }) => {
	const { mutateAsync: createTx, isPending, isError, error } = useCreateTransaction();

	useEffect(() => {
		createTx(payload).catch(() => {});
	}, []);

	if (isPending) return <div>Creating...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return <div>Created</div>;
};

const TestUpdateTransactionComponent = ({ id, payload }: { id: number; payload: TransactionData }) => {
	const { mutateAsync: updateTx, isPending, isError, error } = useUpdateTransaction();

	useEffect(() => {
		updateTx({ id, payload }).catch(() => {});
	}, []);

	if (isPending) return <div>Updating...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return <div>Updated</div>;
};

const TestDeleteTransactionComponent = ({ id }: { id: number }) => {
	const { mutateAsync: deleteTx, isPending, isError, error } = useDeleteTransaction();

	useEffect(() => {
		deleteTx(id).catch(() => {});
	}, []);

	if (isPending) return <div>Deleting...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return <div>Deleted</div>;
};

const TestTransactionsRangeComponent = ({ from, to }: { from: string; to: string }) => {
	const { data, isLoading, isError, error } = useTransactionsRange(from, to);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return <div data-testid="count">{data?.length}</div>;
};

describe("Transactions API", () => {
	describe("useTransactions", () => {
		it("should fetch transactions successfully when API returns data", async () => {
			renderWithProviders(<TestTransactionsComponent />, { preloadState: authenticatedState });

			await waitFor(() => {
				expect(screen.getByTestId("total")).toBeInTheDocument();
			});
		});

		it("should show loading state when fetching transactions", () => {
			renderWithProviders(<TestTransactionsComponent />, { preloadState: authenticatedState });

			expect(screen.getByText("Loading...")).toBeInTheDocument();
		});

		it("should handle API error when server returns 500", async () => {
			// Override to return error response
			server.use(
				http.get("*/transactions", () => {
					return HttpResponse.json({ message: "Failed" }, { status: 500 });
				}),
			);

			const TestErrorComponent = () => {
				const { isLoading, isError, error, data } = useTransactions(0, 10);

				// Return loading state while loading
				if (isLoading && !data) return <div>Loading...</div>;
				// Return error state when there's an error
				if (isError) return <div>Error: {error?.message}</div>;
				// Return data when available
				if (data) return <div data-testid="total">{data.totalElements}</div>;
				return <div>Idle</div>;
			};

			renderWithProviders(<TestErrorComponent />, { preloadState: authenticatedState });

			// Need longer timeout due to query retries
			await waitFor(
				() => {
					expect(screen.getByText(/Error:/)).toBeInTheDocument();
				},
				{ timeout: 30000 },
			);
		});

		it("should handle empty transactions when no data exists", async () => {
			server.use(
				http.get("*/transactions", () => {
					return HttpResponse.json({
						content: [],
						totalElements: 0,
						totalPages: 0,
						page: 0,
						size: 10,
					});
				}),
			);

			renderWithProviders(<TestTransactionsComponent />, { preloadState: authenticatedState });

			await waitFor(() => {
				expect(screen.getByTestId("total")).toHaveTextContent("0");
			});
		});
	});

	describe("useCreateTransaction", () => {
		it("should create transaction successfully when valid data provided", async () => {
			renderWithProviders(
				<TestCreateTransactionComponent
					payload={{
						title: "Test",
						amount: 100,
						type: "EXPENSE",
						category: "Food",
						date: "2024-01-15",
						description: "Test",
						recurring: false,
					}}
				/>,
				{ preloadState: authenticatedState },
			);

			await waitFor(() => {
				expect(screen.getByText("Created")).toBeInTheDocument();
			});
		});

		it("should handle validation error when invalid data provided", async () => {
			server.use(
				http.post("*/transactions", () => {
					return HttpResponse.json({ message: "Validation error" }, { status: 400 });
				}),
			);

			renderWithProviders(
				<TestCreateTransactionComponent
					payload={{
						title: "Test",
						amount: 100,
						type: "EXPENSE",
						category: "Food",
						date: "2024-01-15",
						description: "Test",
						recurring: false,
					}}
				/>,
				{ preloadState: authenticatedState },
			);

			await waitFor(() => {
				expect(screen.getByText(/Error:/)).toBeInTheDocument();
			});
		});
	});

	describe("useUpdateTransaction", () => {
		it("should update transaction successfully when valid data provided", async () => {
			renderWithProviders(
				<TestUpdateTransactionComponent
					id={1}
					payload={{
						title: "Updated",
						amount: 200,
						type: "INCOME",
						category: "Salary",
						date: "2024-01-20",
						description: "Updated",
						recurring: true,
					}}
				/>,
				{ preloadState: authenticatedState },
			);

			await waitFor(() => {
				expect(screen.getByText("Updated")).toBeInTheDocument();
			});
		});

		it("should handle not found error when transaction does not exist", async () => {
			renderWithProviders(
				<TestUpdateTransactionComponent
					id={999}
					payload={{
						title: "Updated",
						amount: 200,
						type: "INCOME",
						category: "Salary",
						date: "2024-01-20",
						description: "Updated",
						recurring: true,
					}}
				/>,
				{ preloadState: authenticatedState },
			);

			await waitFor(() => {
				expect(screen.getByText(/Transaction not found/)).toBeInTheDocument();
			});
		});
	});

	describe("useDeleteTransaction", () => {
		it("should delete transaction successfully when valid ID provided", async () => {
			renderWithProviders(<TestDeleteTransactionComponent id={1} />, {
				preloadState: authenticatedState,
			});

			await waitFor(() => {
				expect(screen.getByText("Deleted")).toBeInTheDocument();
			});
		});

		it("should handle not found error when transaction does not exist", async () => {
			renderWithProviders(<TestDeleteTransactionComponent id={999} />, {
				preloadState: authenticatedState,
			});

			await waitFor(() => {
				expect(screen.getByText(/Transaction not found/)).toBeInTheDocument();
			});
		});
	});

	describe("useTransactionsRange", () => {
		it("should fetch transactions in range successfully when valid dates provided", async () => {
			renderWithProviders(<TestTransactionsRangeComponent from="2024-01-01" to="2024-01-31" />, {
				preloadState: authenticatedState,
			});

			await waitFor(() => {
				expect(screen.getByTestId("count")).toBeInTheDocument();
			});
		});

		it("should not fetch when dates are empty", () => {
			renderWithProviders(<TestTransactionsRangeComponent from="" to="" />, {
				preloadState: authenticatedState,
			});

			// Should not show loading or data when dates are empty
			expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
		});
	});
});
