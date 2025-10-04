import api, { throwError } from "@/api/api-config";
import type { LoginResponse, SignupData, SignupResponse } from "@/types/apiTypes";
import { useMutation } from "@tanstack/react-query";

const loginUser = async ({ email, password }: { email: string; password: string }): Promise<LoginResponse> =>
	api
		.post("/auth/login", { email, password })
		.then(({ data }) => {
			return {
				user: data.user,
				accessToken: data.accessToken,
			};
		})
		.catch(throwError);

export const useLoginMutation = () =>
	useMutation({
		mutationFn: loginUser,
	});

const signupUser = async (data: SignupData): Promise<SignupResponse> =>
	api
		.post("/auth/signup", data)
		.then(({ data }) => {
			console.log(data);

			return {
				user: data.user.email,
				accessToken: data.accessToken,
			};
		})
		.catch(throwError);

export const useSignUpMutation = () =>
	useMutation({
		mutationFn: signupUser,
	});
