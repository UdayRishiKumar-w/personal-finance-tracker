import api from "@/api/api-config";
import { queryClient } from "@/main";
import { setAuthenticated, setLoggedOut } from "@/store/auth/authSlice";
import type { SignupReqData } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async ({ email, password }: { email: string; password: string }) => {
			const { data } = await api.post("/auth/login", { email, password });
			return data;
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
			const { data } = await api.post("/auth/signup", payload);
			return data;
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
			await api.post("/auth/logout");
		},
		onSuccess: () => {
			dispatch(setLoggedOut());
			queryClient.clear();
			navigate("/login", { replace: true });
		},
	});
};
