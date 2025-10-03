import api, { throwError } from "@/api/api-config";
import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
	user: User;
	accessToken: string;
}

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

interface SignupData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

interface User {
	email: string;
}

interface SignupResponse {
	user: User;
	accessToken: string;
}

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

export const useLoginMutation = () =>
	useMutation({
		mutationFn: loginUser,
	});

export const useSignUpMutation = () =>
	useMutation({
		mutationFn: signupUser,
	});
