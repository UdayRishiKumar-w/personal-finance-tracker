import api, { throwError } from "@/api/api-config";
import { queryClient } from "@/main";
import type { LoginResponse, SignupData, SignupResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query";

const loginUser = async ({ email, password }: { email: string; password: string }): Promise<LoginResponse> =>
	api
		.post("/auth/login", { email, password })
		.then(({ status, data }) => {
			if (status === 200) {
				return {
					user: data.user,
					accessToken: data.accessToken,
				};
			}
			throw new Error();
		})
		.catch(throwError);

export const useLoginMutation = () =>
	useMutation({
		mutationFn: loginUser,
		onSuccess: () => {
			queryClient.clear(); // Clear all cached queries
		},
	});

const signupUser = async (data: SignupData): Promise<SignupResponse> =>
	api
		.post("/auth/signup", data)
		.then(({ status, data }) => {
			console.log(data);

			if (status === 200) {
				return {
					user: data.user,
					accessToken: data.accessToken,
				};
			}
			throw new Error();
		})
		.catch(throwError);

export const useSignUpMutation = () =>
	useMutation({
		mutationFn: signupUser,
		onSuccess: () => {
			queryClient.clear(); // Clear all cached queries
		},
	});
