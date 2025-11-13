import { languageOptions } from "@/Constants";
import type { BackendError } from "@/types/globalTypes";
import { isAxiosError, type AxiosError } from "axios";

export const getLangSupported = (lang: string): (typeof languageOptions)[number]["code"] => {
	const langSupported = languageOptions.find(({ code }) => lang === code || lang.startsWith(`${code}-`));

	return langSupported ? langSupported.code : "en";
};

export const handleApiResponse = <T>({ data, status }: { data: T; status: number }): T => {
	if (status >= 200 && status < 300) {
		return data;
	}

	let errorMessage;
	const errorData = data as Partial<BackendError>;

	if (errorData?.message) {
		errorMessage = errorData.message;
	} else {
		errorMessage = `Request failed with status: ${status}`;
	}
	throw new Error(errorMessage);
};

export const handleApiError = (error: unknown): never => {
	let alertMessage = "An error occurred, please try again later!";

	if (isAxiosError(error)) {
		const axiosError = error as AxiosError;
		if (axiosError.response) {
			alertMessage = (axiosError.response.data as Partial<BackendError>)?.message || alertMessage;
		} else if (axiosError.request) {
			alertMessage = "The server did not respond. Check your connection.";
		} else {
			alertMessage = error.message;
		}
	} else if (error instanceof Error) {
		alertMessage = error?.message || alertMessage;
	}

	throw new Error(alertMessage);
};
