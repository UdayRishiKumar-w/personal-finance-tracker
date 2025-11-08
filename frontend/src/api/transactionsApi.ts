import api from "@/api/api-config";
import type { TransactionData } from "@/types/globalTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTransactions = (page = 0, size = 10) => {
	return useQuery({
		queryKey: ["transactions", page, size],
		queryFn: async () => {
			const params = new URLSearchParams({ page: String(page), size: String(size) });
			const { data } = await api.get(`/transactions?${params}`);
			return data;
		},
		retry: true,
	}); // use stale data while no network like that handle, use pagination tan stack - try.
};

export const useCreateTransaction = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload: TransactionData) => api.post("/transactions", payload).then((r) => r.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
	});
};

export const useUpdateTransaction = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }: { id: number; payload: TransactionData }) =>
			api.put(`/transactions/${id}`, payload).then((r) => r.data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
	});
};

export const useDeleteTransaction = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => api.delete(`/transactions/${id}`),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
	});
};

export const useTransactionsRange = (from: string, to: string) => {
	return useQuery({
		queryKey: ["transactions-range", from, to],
		queryFn: async () => {
			const params = new URLSearchParams({ from, to });
			return api.get(`/transactions/range?${params}`).then((r) => r.data);
		},
		enabled: !!from && !!to,
	});
};
