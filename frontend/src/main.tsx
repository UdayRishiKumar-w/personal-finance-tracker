import "@/styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/context/ThemeContext";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { store } from "./store/store";

import PWABadge from "@/PWABadge";

import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/layouts/Layout";
import { reportWebVitals } from "@/utils/reportWebVitals";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
// eslint-disable-next-line no-restricted-imports
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { prefixer } from "stylis";
import "./i18n.tsx";

const scriptWithNonce = document.querySelector("script[nonce]");
const nonce = (scriptWithNonce as HTMLScriptElement)?.nonce;

const insertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
// Create Emotion cache with nonce so MUI styles get CSP-compatible style tags
const muiCache = createCache({
	key: "mui",
	nonce,
	insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
	stylisPlugins: [prefixer, rtlPlugin],
});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 5 * 60 * 1000,
			retry: 3,
			retryDelay: 1000,
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CacheProvider value={muiCache}>
			<StyledEngineProvider enableCssLayer>
				<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
				<ErrorBoundary>
					<Provider store={store}>
						<AuthProvider>
							<ThemeProvider>
								<QueryClientProvider client={queryClient}>
									<BrowserRouter>
										<Layout>
											<AppRouter />
										</Layout>
										<PWABadge />
									</BrowserRouter>
									{import.meta.env.DEV && (
										<TanStackDevtools
											plugins={[
												{
													name: "TanStack Query",
													render: <ReactQueryDevtoolsPanel />,
												},
											]}
										/>
										/* <ReactQueryDevtools initialIsOpen={false} /> */
									)}
								</QueryClientProvider>
							</ThemeProvider>
						</AuthProvider>
					</Provider>
				</ErrorBoundary>
			</StyledEngineProvider>
		</CacheProvider>
	</StrictMode>,
);

if (import.meta.env.DEV) {
	reportWebVitals();
}
