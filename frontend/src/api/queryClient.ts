import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			gcTime: 5 * 60 * 1000,
			staleTime: 60 * 1000,
			retryDelay: 1000,
			networkMode: "online",
			meta: {
				timeout: 30 * 1000,
			},
		},
		mutations: {
			retry: false,
			networkMode: "always",
			meta: {
				timeout: 30 * 1000,
			},
		},
	},
});
