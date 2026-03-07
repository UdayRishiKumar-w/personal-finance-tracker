import authReducer from "@/store/auth/authSlice";
import snackbarReducer from "@/store/snack-bar/snackbarSlice";
import type { RootState } from "@/store/store";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import i18n from "i18next";
import { axe } from "jest-axe";
import type { PropsWithChildren, ReactElement } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

// Create a test theme for MUI components
const testTheme = createTheme({
	palette: {
		mode: "light",
	},
});

// Create a test store with optional preloaded state
export function createMockStore(preloadedState?: Partial<RootState>) {
	return configureStore({
		reducer: {
			auth: authReducer,
			snackbar: snackbarReducer,
		},
		preloadedState: preloadedState as RootState,
	});
}

export type AppStore = ReturnType<typeof createMockStore>;

function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				refetchOnWindowFocus: false,
				gcTime: 0,
				staleTime: 0,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

function createTestI18n() {
	const instance = i18n.createInstance();
	instance.use(initReactI18next).init({
		lng: "en",
		fallbackLng: "en",
		resources: {
			en: {
				translation: {
					login: "Login",
					signup: "Sign Up",
					email: "Email",
					password: "Password",
					firstName: "First Name",
					lastName: "Last Name",
					invalidEmail: "Invalid email format",
					passwordRequired: "Password is required",
					firstNameRequired: "First name is required",
					lastNameRequired: "Last name is required",
					passwordMinRequired: "Password must be at least 10 characters",
					passwordComplexity: "Password must contain uppercase, lowercase, number, and special character",
					enterEmail: "Enter your email",
					enterPassword: "Enter your password",
					enterFirstName: "Enter your first name",
					enterLastName: "Enter your last name",
					dontHaveAccount: "Don't have an account?",
					alreadyHaveAccount: "Already have an account?",
					loggingIn: "Logging in",
					signingUp: "Signing up",
					appName: "Personal Finance Tracker",
				},
				loader: {
					loading: "Loading",
				},
			},
			ar: {
				translation: {
					login: "تسجيل الدخول",
				},
			},
		},
		interpolation: { escapeValue: false },
	});

	return instance;
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
	route?: string;
	preloadState?: Partial<RootState>;
	store?: AppStore;
}

// Default authenticated state for convenience
export const authenticatedState: Partial<RootState> = {
	auth: {
		isAuthenticated: true,
		user: {
			id: "123",
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			role: "user",
		},
	},
	snackbar: {
		open: false,
		message: "",
		severity: "info",
	},
};

export function renderWithProviders(
	ui: ReactElement,
	{ route = "/", preloadState, store: providedStore, ...options }: CustomRenderOptions = {},
) {
	const queryClient = createTestQueryClient();
	const i18nInstance = createTestI18n();
	const store = providedStore ?? createMockStore(preloadState);

	function Wrapper({ children }: Readonly<PropsWithChildren>) {
		return (
			<Provider store={store}>
				<MemoryRouter initialEntries={[route]}>
					<QueryClientProvider client={queryClient}>
						<ThemeProvider theme={testTheme}>
							<CssBaseline />
							<I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
						</ThemeProvider>
					</QueryClientProvider>
				</MemoryRouter>
			</Provider>
		);
	}

	return { ...render(ui, { wrapper: Wrapper, ...options }), store, queryClient };
}

export async function runAxe(container: HTMLElement) {
	return axe(
		container,
		// {
		// 	// https://github.com/GoogleChrome/lighthouse/blob/main/core/gather/gatherers/accessibility.js#L28-L86
		// 	rules: {
		// 		"color-contrast": { enabled: false }, // Disable color contrast rule for tests
		// 	},
		// }
	);
}
