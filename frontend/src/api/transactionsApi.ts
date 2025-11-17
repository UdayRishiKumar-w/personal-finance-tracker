import api from "@/api/api-config";
import type { RootState } from "@/store/store";
import type { PaginatedResponse, TransactionData } from "@/types/globalTypes";
import { handleApiError, handleApiResponse } from "@/utils/commonUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useTransactions = (page = 0, size = 10) => {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

	return useQuery({
		queryKey: ["transactions", page, size],
		queryFn: async () => {
			const params = new URLSearchParams({ page: String(page), size: String(size) });
			const { data }: { data: PaginatedResponse<TransactionData> } = await api.get(
				`/transactions?${params.toString()}`,
			);
			return data;
		},
		retry: true,
		enabled: isAuthenticated,
	}); // use stale data while no network like that handle, use pagination tan stack - try.
};

export const useCreateTransaction = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: TransactionData) => {
			try {
				const response: { data: TransactionData; status: number } = await api.post("/transactions", payload);
				return handleApiResponse(response);
			} catch (e) {
				handleApiError(e);
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
	});
};

export const useUpdateTransaction = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, payload }: { id: number; payload: TransactionData }) => {
			try {
				const response: { data: TransactionData; status: number } = await api.put(
					`/transactions/${id}`,
					payload,
				);
				return handleApiResponse(response);
			} catch (e) {
				handleApiError(e);
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
	});
};

export const useDeleteTransaction = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			try {
				const response: { data: TransactionData; status: number } = await api.delete(`/transactions/${id}`);
				return handleApiResponse(response);
			} catch (e) {
				handleApiError(e);
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
	});
};

export const useTransactionsRange = (from: string, to: string) => {
	return useQuery({
		queryKey: ["transactions-range", from, to],
		queryFn: async () => {
			const params = new URLSearchParams({ from, to });
			return api.get(`/transactions/range?${params.toString()}`).then((r) => r.data as TransactionData[]);
		},
		enabled: !!from && !!to,
	});
};
