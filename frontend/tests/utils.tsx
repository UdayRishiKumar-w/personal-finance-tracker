import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import i18n from "i18next";
import type { PropsWithChildren, ReactElement } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				refetchOnWindowFocus: false,
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
				translation: {},
			},
		},
		interpolation: { escapeValue: false },
	});

	return instance;
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
	route?: string;
}

export function renderWithProviders(ui: ReactElement, { route = "/", ...options }: CustomRenderOptions = {}) {
	const queryClient = createTestQueryClient();
	const i18nInstance = createTestI18n();

	function Wrapper({ children }: Readonly<PropsWithChildren>) {
		return (
			<MemoryRouter initialEntries={[route]}>
				<QueryClientProvider client={queryClient}>
					<I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
				</QueryClientProvider>
			</MemoryRouter>
		);
	}

	return render(ui, { wrapper: Wrapper, ...options });
}
