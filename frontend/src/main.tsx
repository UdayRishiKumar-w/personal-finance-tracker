import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import AppRouter from "./routes/AppRouter";

import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";

import * as serviceWorker from "./serviceWorker";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StyledEngineProvider enableCssLayer>
			<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
			<Provider store={store}>
				<BrowserRouter>
					<AppRouter />
				</BrowserRouter>
			</Provider>
		</StyledEngineProvider>
	</StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
