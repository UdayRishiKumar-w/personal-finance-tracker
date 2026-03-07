import snackbarReducer, { hideSnackbar, showSnackbar } from "@/store/snack-bar/snackbarSlice";
import { describe, expect, it } from "vitest";

describe("snackbarSlice", () => {
	describe("initial state", () => {
		it("should return the initial state", () => {
			const initialState = snackbarReducer(undefined, { type: "unknown" });
			expect(initialState).toEqual({
				open: false,
				message: "",
				severity: "info",
			});
		});
	});

	describe("showSnackbar", () => {
		it("should set open to true", () => {
			const state = snackbarReducer(undefined, showSnackbar({ message: "Test message" }));
			expect(state.open).toBe(true);
		});

		it("should set the message", () => {
			const state = snackbarReducer(undefined, showSnackbar({ message: "Success message" }));
			expect(state.message).toBe("Success message");
		});

		it("should default severity to 'info' when not provided", () => {
			const state = snackbarReducer(undefined, showSnackbar({ message: "Test" }));
			expect(state.severity).toBe("info");
		});

		it("should set severity to 'success'", () => {
			const state = snackbarReducer(
				undefined,
				showSnackbar({ message: "Operation successful", severity: "success" }),
			);
			expect(state.severity).toBe("success");
		});

		it("should set severity to 'error'", () => {
			const state = snackbarReducer(undefined, showSnackbar({ message: "Operation failed", severity: "error" }));
			expect(state.severity).toBe("error");
		});

		it("should set severity to 'warning'", () => {
			const state = snackbarReducer(undefined, showSnackbar({ message: "Warning message", severity: "warning" }));
			expect(state.severity).toBe("warning");
		});

		it("should set severity to 'info'", () => {
			const state = snackbarReducer(undefined, showSnackbar({ message: "Info message", severity: "info" }));
			expect(state.severity).toBe("info");
		});

		it("should replace existing snackbar state", () => {
			const existingState = {
				open: true,
				message: "Old message",
				severity: "error" as const,
			};
			const state = snackbarReducer(existingState, showSnackbar({ message: "New message", severity: "success" }));
			expect(state.message).toBe("New message");
			expect(state.severity).toBe("success");
		});
	});

	describe("hideSnackbar", () => {
		it("should set open to false", () => {
			const openState = {
				open: true,
				message: "Test message",
				severity: "info" as const,
			};
			const state = snackbarReducer(openState, hideSnackbar());
			expect(state.open).toBe(false);
		});

		it("should clear the message", () => {
			const openState = {
				open: true,
				message: "Test message",
				severity: "info" as const,
			};
			const state = snackbarReducer(openState, hideSnackbar());
			expect(state.message).toBe("");
		});

		it("should not change severity", () => {
			const openState = {
				open: true,
				message: "Test message",
				severity: "error" as const,
			};
			const state = snackbarReducer(openState, hideSnackbar());
			expect(state.severity).toBe("error");
		});

		it("should work when already hidden", () => {
			const hiddenState = {
				open: false,
				message: "",
				severity: "info" as const,
			};
			const state = snackbarReducer(hiddenState, hideSnackbar());
			expect(state.open).toBe(false);
			expect(state.message).toBe("");
		});
	});
});
