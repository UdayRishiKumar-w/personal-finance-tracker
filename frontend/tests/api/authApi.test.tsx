import { useLoginMutation, useLogout, useSignUpMutation } from "@/api/authApi";
import type { SignupReqData } from "@/types/apiTypes";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authenticatedState, renderWithProviders } from "@tests/utils";
import { useEffect, useState } from "react";
import { describe, expect, it } from "vitest";

// Test component that uses the hook with manual trigger for loading state tests
const TestLoginComponent = ({
	email,
	password,
	deferMutation = false,
}: {
	email: string;
	password: string;
	deferMutation?: boolean;
}) => {
	const { mutateAsync: login, isPending, isError, error } = useLoginMutation();
	const [started, setStarted] = useState(false);

	useEffect(() => {
		if (deferMutation) {
			setStarted(true);
		} else {
			login({ email, password }).catch(() => {});
		}
	}, []);

	const handleStart = () => {
		login({ email, password }).catch(() => {});
	};

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return (
		<div>
			{deferMutation && started && <button onClick={handleStart}>Start Login</button>}
			Success
		</div>
	);
};

const TestSignupComponent = ({ data }: { data: SignupReqData }) => {
	const { mutateAsync: signup, isPending, isError, error } = useSignUpMutation();

	useEffect(() => {
		signup(data).catch(() => {});
	}, []);

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return <div>Success</div>;
};

const TestLogoutComponent = ({ deferMutation = false }: { deferMutation?: boolean }) => {
	const { mutateAsync: logout, isPending, isError, error } = useLogout();
	const [started, setStarted] = useState(false);

	useEffect(() => {
		if (deferMutation) {
			setStarted(true);
		} else {
			logout().catch(() => {});
		}
	}, []);

	const handleStart = () => {
		logout().catch(() => {});
	};

	if (isPending) return <div>Logging out...</div>;
	if (isError) return <div>Error: {error?.message}</div>;
	return (
		<div>
			{deferMutation && started && <button onClick={handleStart}>Start Logout</button>}
			Logged out
		</div>
	);
};

describe("Auth API", () => {
	describe("useLoginMutation", () => {
		it("should complete login successfully when valid credentials provided", async () => {
			renderWithProviders(<TestLoginComponent email="test@example.com" password="password123" />);

			await waitFor(() => {
				expect(screen.getByText("Success")).toBeInTheDocument();
			});
		});

		it("should handle invalid credentials error when wrong password provided", async () => {
			renderWithProviders(<TestLoginComponent email="invalid@example.com" password="wrong" />);

			await waitFor(() => {
				expect(screen.getByText(/Error:/)).toBeInTheDocument();
			});
		});

		it("should handle user not found error when email does not exist", async () => {
			renderWithProviders(<TestLoginComponent email="notfound@example.com" password="password" />);

			await waitFor(() => {
				expect(screen.getByText(/User not found/)).toBeInTheDocument();
			});
		});

		it("should handle server error when API returns 500", async () => {
			renderWithProviders(<TestLoginComponent email="servererror@example.com" password="password" />);

			await waitFor(() => {
				expect(screen.getByText(/Internal server error/)).toBeInTheDocument();
			});
		});

		it("should show loading state during login when mutation is in progress", async () => {
			// Use deferred mutation to test loading state reliably
			renderWithProviders(<TestLoginComponent email="test@example.com" password="password123" deferMutation />);

			// Click button to start login
			const startButton = screen.getByRole("button", { name: /start login/i });
			await userEvent.click(startButton);

			// Now we should see loading state
			expect(screen.getByText("Loading...")).toBeInTheDocument();

			// Then success
			await waitFor(() => {
				expect(screen.getByText("Success")).toBeInTheDocument();
			});
		});
	});

	describe("useSignUpMutation", () => {
		it("should complete signup successfully when valid data provided", async () => {
			renderWithProviders(
				<TestSignupComponent
					data={{
						email: "newuser@example.com",
						password: "ValidPass123!",
						firstName: "John",
						lastName: "Doe",
					}}
				/>,
			);

			await waitFor(() => {
				expect(screen.getByText("Success")).toBeInTheDocument();
			});
		});

		it("should handle email already exists error when email is registered", async () => {
			renderWithProviders(
				<TestSignupComponent
					data={{
						email: "existing@example.com",
						password: "ValidPass123!",
						firstName: "John",
						lastName: "Doe",
					}}
				/>,
			);

			await waitFor(() => {
				expect(screen.getByText(/Email already registered/)).toBeInTheDocument();
			});
		});
	});

	describe("useLogout", () => {
		it("should complete logout successfully when user is authenticated", async () => {
			renderWithProviders(<TestLogoutComponent />, { preloadState: authenticatedState });

			await waitFor(() => {
				expect(screen.getByText("Logged out")).toBeInTheDocument();
			});
		});

		it("should show loading state during logout when mutation is in progress", async () => {
			// Use deferred mutation to test loading state reliably
			renderWithProviders(<TestLogoutComponent deferMutation />, { preloadState: authenticatedState });

			// Click button to start logout
			const startButton = screen.getByRole("button", { name: /start logout/i });
			await userEvent.click(startButton);

			// Now we should see loading state
			expect(screen.getByText("Logging out...")).toBeInTheDocument();

			// Then success
			await waitFor(() => {
				expect(screen.getByText("Logged out")).toBeInTheDocument();
			});
		});
	});
});
