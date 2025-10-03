import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Menu } from "@/components/Menu";
import { ThemeProvider } from "@/context/ThemeContext";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { store } from "./store/store";

import PWABadge from "@/PWABadge";

import ErrorBoundary from "@/components/ErrorBoundary";
import { reportWebVitals } from "@/reportWebVitals";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

const scriptWithNonce = document.querySelector("script[nonce]");
const nonce = (scriptWithNonce as HTMLScriptElement)?.nonce;

const insertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
// Create Emotion cache with nonce so MUI styles get CSP-compatible style tags
const muiCache = createCache({
	key: "mui",
	nonce,
	insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CacheProvider value={muiCache}>
			<StyledEngineProvider enableCssLayer>
				<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
				<Provider store={store}>
					<ErrorBoundary>
						<ThemeProvider>
							<QueryClientProvider client={queryClient}>
								<BrowserRouter>
									<Menu />
									<AppRouter />
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
								)}
							</QueryClientProvider>
						</ThemeProvider>
					</ErrorBoundary>
				</Provider>
			</StyledEngineProvider>
		</CacheProvider>
	</StrictMode>,
);

if (import.meta.env.DEV) {
	reportWebVitals();
}
