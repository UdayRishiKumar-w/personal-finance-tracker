import { languageOptions } from "@/Constants";
import { getLangSupported, handleApiError, handleApiResponse } from "@/utils/commonUtils";
import axios, { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

describe("commonUtils", () => {
	describe("getLangSupported", () => {
		it("returns the matching language code for exact match", () => {
			expect(getLangSupported("en")).toBe("en");
			expect(getLangSupported("de")).toBe("de");
			expect(getLangSupported("ar")).toBe("ar");
			expect(getLangSupported("ru")).toBe("ru");
			expect(getLangSupported("ja")).toBe("ja");
		});

		it("returns the matching language code for partial match (e.g., en-US)", () => {
			expect(getLangSupported("en-US")).toBe("en");
			expect(getLangSupported("en-GB")).toBe("en");
			expect(getLangSupported("de-DE")).toBe("de");
			expect(getLangSupported("ar-SA")).toBe("ar");
		});

		it("returns 'en' as fallback for unsupported languages", () => {
			expect(getLangSupported("fr")).toBe("en");
			expect(getLangSupported("es")).toBe("en");
			expect(getLangSupported("zh")).toBe("en");
			expect(getLangSupported("")).toBe("en");
		});

		it("handles case sensitivity correctly", () => {
			// Language codes are case-sensitive, so uppercase won't match
			expect(getLangSupported("EN")).toBe("en");
			expect(getLangSupported("EN-US")).toBe("en");
		});

		it("returns correct code for all supported language options", () => {
			languageOptions.forEach(({ code }) => {
				expect(getLangSupported(code)).toBe(code);
			});
		});
	});

	describe("handleApiResponse", () => {
		it("returns data for successful responses (2xx status)", () => {
			const mockData = { id: 1, name: "Test" };
			const result = handleApiResponse({ data: mockData, status: 200 });
			expect(result).toEqual(mockData);
		});

		it("returns data for 201 Created status", () => {
			const mockData = { id: 1, created: true };
			const result = handleApiResponse({ data: mockData, status: 201 });
			expect(result).toEqual(mockData);
		});

		it("returns data for 204 No Content status", () => {
			const result = handleApiResponse({ data: null, status: 204 });
			expect(result).toBeNull();
		});

		it("throws error with message from response for 4xx status", () => {
			const errorData = { message: "Bad request error" };
			expect(() => handleApiResponse({ data: errorData, status: 400 })).toThrow("Bad request error");
		});

		it("throws error with message from response for 5xx status", () => {
			const errorData = { message: "Internal server error" };
			expect(() => handleApiResponse({ data: errorData, status: 500 })).toThrow("Internal server error");
		});

		it("throws generic error message when response has no message", () => {
			expect(() => handleApiResponse({ data: {}, status: 400 })).toThrow("Request failed with status: 400");
		});

		it("throws generic error message when response data is null", () => {
			expect(() => handleApiResponse({ data: null, status: 500 })).toThrow("Request failed with status: 500");
		});

		it("throws generic error message when response data is undefined", () => {
			expect(() => handleApiResponse({ data: undefined, status: 404 })).toThrow(
				"Request failed with status: 404",
			);
		});

		it("handles edge case at status code boundaries", () => {
			// Status 299 should succeed
			const successData = { result: "ok" };
			expect(handleApiResponse({ data: successData, status: 299 })).toEqual(successData);

			// Status 300 should fail
			expect(() => handleApiResponse({ data: {}, status: 300 })).toThrow();
		});
	});

	describe("handleApiError", () => {
		it("throws error with response message for AxiosError with response", () => {
			const error = new AxiosError("Request failed");
			error.response = {
				data: { message: "User not found" },
				status: 404,
				statusText: "Not Found",
				headers: {},
				config: {} as never,
			};

			expect(() => handleApiError(error)).toThrow("User not found");
		});

		it("throws default message for AxiosError with response but no message", () => {
			const error = new AxiosError("Request failed");
			error.response = {
				data: {},
				status: 500,
				statusText: "Internal Server Error",
				headers: {},
				config: {} as never,
			};

			expect(() => handleApiError(error)).toThrow("An error occurred, please try again later!");
		});

		it("throws server connection error for AxiosError with request but no response", () => {
			const error = new AxiosError("Network Error");
			error.request = {} as never;

			expect(() => handleApiError(error)).toThrow("The server did not respond. Check your connection.");
		});

		it("throws error message for AxiosError without request or response", () => {
			const error = new AxiosError("Configuration error");

			expect(() => handleApiError(error)).toThrow("Configuration error");
		});

		it("throws error message for generic Error instances", () => {
			const error = new Error("Something went wrong");
			expect(() => handleApiError(error)).toThrow("Something went wrong");
		});

		it("throws default message for Error with empty message", () => {
			const error = new Error("");
			expect(() => handleApiError(error)).toThrow("An error occurred, please try again later!");
		});

		it("throws default message for non-Error throws", () => {
			expect(() => handleApiError("string error")).toThrow("An error occurred, please try again later!");
			expect(() => handleApiError(null)).toThrow("An error occurred, please try again later!");
			expect(() => handleApiError(undefined)).toThrow("An error occurred, please try again later!");
			expect(() => handleApiError({ custom: "error" })).toThrow("An error occurred, please try again later!");
		});

		it("handles axios error with isAxiosError property", () => {
			const axiosError = new AxiosError("Request failed");
			axiosError.response = {
				data: { message: "Unauthorized access" },
				status: 401,
				statusText: "Unauthorized",
				headers: {},
				config: {} as never,
			};

			expect(axios.isAxiosError(axiosError)).toBe(true);
			expect(() => handleApiError(axiosError)).toThrow("Unauthorized access");
		});
	});
});
