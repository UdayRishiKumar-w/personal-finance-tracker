export interface User {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	id: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
}

export interface SnackbarState {
	open: boolean;
	message: string;
	severity: "success" | "error" | "warning" | "info";
}
