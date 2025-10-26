import useIsRTL from "@/hooks/useIsRTL";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
// eslint-disable-next-line no-restricted-imports
import rtlPlugin from "@mui/stylis-plugin-rtl";
import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";
import { prefixer } from "stylis";

const scriptWithNonce = document.querySelector("script[nonce]");
const nonce = (scriptWithNonce as HTMLScriptElement)?.nonce;

const insertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');

const EmotionCacheProvider: FC<PropsWithChildren> = ({ children }) => {
	const isRTL = useIsRTL();

	// Create Emotion cache with nonce so MUI styles get CSP-compatible style tags
	const muiCache = useMemo(() => {
		if (isRTL) {
			return createCache({
				key: "muirtl",
				nonce,
				insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
				stylisPlugins: [prefixer, rtlPlugin],
			});
		}
		return createCache({
			key: "mui",
			nonce,
			insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
			stylisPlugins: [prefixer],
		});
	}, [isRTL]);

	return <CacheProvider value={muiCache}>{children}</CacheProvider>;
};

export default EmotionCacheProvider;
