import api, { healthApi } from "@/api/api-config";
import { queryClient } from "@/api/queryClient";
import { setAuthenticated, setLoggedOut } from "@/store/auth/authSlice";
import type { SignupReqData } from "@/types/apiTypes";
import { handleApiError, handleApiResponse } from "@/utils/commonUtils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * Health check query to start the cold startup of the backend server.
 * Retries until a successful response is received.
 */
export const useHealthCheckQuery = () => {
	return useQuery({
		queryKey: ["health"],
		queryFn: async () => {
			const { data } = await healthApi.get("");
			return data;
		},
		retry: true, // keep retrying until success
		retryDelay: 10000, // 10 seconds between retry attempts
		enabled: import.meta.env.VITE_IS_HOSTED_ON_VERCEL === "true",
	});
};

export const useLoginMutation = () => {
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async ({ email, password }: { email: string; password: string }) => {
			try {
				const response = await api.post("/auth/login", { email, password });
				return handleApiResponse(response);
			} catch (e) {
				handleApiError(e);
			}
		},
		onSuccess: (data) => {
			dispatch(setAuthenticated(data.user));
		},
	});
};

export const useSignUpMutation = () => {
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async (payload: SignupReqData) => {
			try {
				const response = await api.post("/auth/signup", payload);
				return handleApiResponse(response);
			} catch (e) {
				handleApiError(e);
			}
		},
		onSuccess: (data) => {
			dispatch(setAuthenticated(data.user));
		},
	});
};

export const useLogout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async () => {
			try {
				const response = await api.post("/auth/logout");
				return handleApiResponse(response);
			} catch (e) {
				handleApiError(e);
			}
		},
		onSuccess: () => {
			dispatch(setLoggedOut());
			localStorage.removeItem("isLoggedIn");
			queryClient.clear();
			void navigate("/login", { replace: true });
		},
	});
};
