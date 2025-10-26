import type { AxiosRequestConfig } from "axios";

export interface SignupReqData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}
