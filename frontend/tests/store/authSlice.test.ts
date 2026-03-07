import authReducer, { setAuthenticated, setLoggedOut } from "@/store/auth/authSlice";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("authSlice", () => {
	describe("initial state", () => {
		it("should return the initial state", () => {
			const initialState = authReducer(undefined, { type: "unknown" });
			expect(initialState).toEqual({
				isAuthenticated: false,
				user: null,
			});
		});
	});

	describe("setAuthenticated", () => {
		let setItemSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			setItemSpy = vi.spyOn(Storage.prototype, "setItem");
		});

		it("should set isAuthenticated to true", () => {
			const user = {
				id: "123",
				firstName: "John",
				lastName: "Doe",
				email: "john@example.com",
				role: "user",
			};
			const state = authReducer(undefined, setAuthenticated(user));
			expect(state.isAuthenticated).toBe(true);
		});

		it("should set the user object", () => {
			const user = {
				id: "123",
				firstName: "John",
				lastName: "Doe",
				email: "john@example.com",
				role: "user",
			};
			const state = authReducer(undefined, setAuthenticated(user));
			expect(state.user).toEqual(user);
		});

		it("should store isLoggedIn in localStorage", () => {
			const user = {
				id: "123",
				firstName: "Jane",
				lastName: "Smith",
				email: "jane@example.com",
				role: "admin",
			};
			authReducer(undefined, setAuthenticated(user));
			expect(setItemSpy).toHaveBeenCalledWith("isLoggedIn", "true");
		});

		it("should work with user having different roles", () => {
			const adminUser = {
				id: "1",
				firstName: "Admin",
				lastName: "User",
				email: "admin@example.com",
				role: "admin",
			};
			const state = authReducer(undefined, setAuthenticated(adminUser));
			expect(state.user?.role).toBe("admin");
		});

		it("should update state when called on existing state", () => {
			const initialState = {
				isAuthenticated: true,
				user: {
					id: "old",
					firstName: "Old",
					lastName: "User",
					email: "old@example.com",
					role: "user",
				},
			};
			const newUser = {
				id: "new",
				firstName: "New",
				lastName: "User",
				email: "new@example.com",
				role: "user",
			};
			const state = authReducer(initialState, setAuthenticated(newUser));
			expect(state.user).toEqual(newUser);
		});
	});

	describe("setLoggedOut", () => {
		it("should set isAuthenticated to false", () => {
			const authenticatedState = {
				isAuthenticated: true,
				user: {
					id: "123",
					firstName: "John",
					lastName: "Doe",
					email: "john@example.com",
					role: "user",
				},
			};
			const state = authReducer(authenticatedState, setLoggedOut());
			expect(state.isAuthenticated).toBe(false);
		});

		it("should set user to null", () => {
			const authenticatedState = {
				isAuthenticated: true,
				user: {
					id: "123",
					firstName: "John",
					lastName: "Doe",
					email: "john@example.com",
					role: "user",
				},
			};
			const state = authReducer(authenticatedState, setLoggedOut());
			expect(state.user).toBeNull();
		});

		it("should work when already logged out", () => {
			const loggedOutState = {
				isAuthenticated: false,
				user: null,
			};
			const state = authReducer(loggedOutState, setLoggedOut());
			expect(state.isAuthenticated).toBe(false);
			expect(state.user).toBeNull();
		});
	});
});
