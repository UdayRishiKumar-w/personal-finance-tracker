import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { store } from "./store/store";

import PWABadge from "@/PWABadge";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import ErrorBoundary from "./components/ErrorBoundary";
import { reportWebVitals } from "./reportWebVitals";

const scriptWithNonce = document.querySelector("script[nonce]");
const nonce = (scriptWithNonce as HTMLScriptElement)?.nonce;

const insertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
// Create Emotion cache with nonce so MUI styles get CSP-compatible style tags
const muiCache = createCache({
	key: "mui",
	nonce,
	insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CacheProvider value={muiCache}>
			<StyledEngineProvider enableCssLayer>
				<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
				<Provider store={store}>
					<ErrorBoundary>
						<BrowserRouter>
							<AppRouter />
							<PWABadge />
						</BrowserRouter>
					</ErrorBoundary>
				</Provider>
			</StyledEngineProvider>
		</CacheProvider>
	</StrictMode>,
);

if (import.meta.env.DEV) {
	reportWebVitals();
}
