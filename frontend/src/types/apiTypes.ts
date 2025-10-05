import type { AxiosRequestConfig } from "axios";

export interface LoginResponse {
	user: User;
	accessToken: string;
}

export interface SignupData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface User {
	email: string;
}

export interface SignupResponse {
	user: User;
	accessToken: string;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}
