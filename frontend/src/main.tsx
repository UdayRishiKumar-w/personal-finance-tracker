import "@/styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/context/ThemeContext";
import PWABadge from "@/PWABadge";
import AppRouter from "@/routes/AppRouter";
import { store } from "@/store/store.ts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { queryClient } from "@/api/queryClient";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SnackbarProvider } from "@/components/SnackbarProvider";
import EmotionCacheProvider from "@/context/EmotionCacheProvider";
import "@/i18n";
import Layout from "@/layouts/Layout";
import { reportWebVitals } from "@/utils/reportWebVitals";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<StyledEngineProvider enableCssLayer>
					<GlobalStyles styles="@layer theme, base, mui, emotion, components, utilities, properties;" />
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
								{import.meta.env.VITE_IS_HOSTED_ON_VERCEL === "true" && (
									<>
										<Analytics />
										<SpeedInsights />
									</>
								)}
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
