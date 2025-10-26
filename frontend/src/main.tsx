import "@/styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/context/ThemeContext";
import PWABadge from "@/PWABadge";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { store } from "./store/store";

import ErrorBoundary from "@/components/ErrorBoundary";
import { SnackbarProvider } from "@/components/SnackbarProvider.tsx";
import EmotionCacheProvider from "@/context/EmotionCacheProvider";
import Layout from "@/layouts/Layout";
import { reportWebVitals } from "@/utils/reportWebVitals";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import "./i18n.tsx";

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
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<StyledEngineProvider enableCssLayer>
					<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
					<EmotionCacheProvider>
						<ThemeProvider>
							<ErrorBoundary>
								<BrowserRouter>
									<Layout>
										<AppRouter />
									</Layout>
									<SnackbarProvider />
									<PWABadge />
								</BrowserRouter>
								<Analytics />
								<SpeedInsights />
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
							</ErrorBoundary>
						</ThemeProvider>
					</EmotionCacheProvider>
				</StyledEngineProvider>
			</QueryClientProvider>
		</Provider>
	</StrictMode>,
);

if (import.meta.env.DEV) {
	reportWebVitals();
}

if (import.meta.env.DEV) {
	try {
		const React = await import("react");
		const ReactDOM = await import("react-dom");
		const axe = await import("@axe-core/react");
		axe.default(React, ReactDOM, 1000);
	} catch (error) {
		console.error("Error loading dependencies:", error);
	}
}
