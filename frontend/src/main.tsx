import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { store } from "./store/store";

import PWABadge from "@/PWABadge";
import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import { reportWebVitals } from './reportWebVitals';

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StyledEngineProvider enableCssLayer>
			<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
			<Provider store={store}>
				<BrowserRouter>
					<>
						<PWABadge />
						<AppRouter />
					</>
				</BrowserRouter>
			</Provider>
		</StyledEngineProvider>
	</StrictMode>,
);

reportWebVitals();
