import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
// eslint-disable-next-line no-restricted-imports
import rtlPlugin from "@mui/stylis-plugin-rtl";
import type { FC, PropsWithChildren } from "react";
import { prefixer } from "stylis";

const scriptWithNonce = document.querySelector("script[nonce]");
const nonce = (scriptWithNonce as HTMLScriptElement)?.nonce;

const insertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');

const EmotionCacheProvider: FC<PropsWithChildren> = ({ children }) => {
	// Create Emotion cache with nonce so MUI styles get CSP-compatible style tags
	const muiCache = createCache({
		key: "mui",
		nonce,
		insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
		stylisPlugins: [prefixer, rtlPlugin],
	});

	return <CacheProvider value={muiCache}>{children}</CacheProvider>;
};

export default EmotionCacheProvider;
