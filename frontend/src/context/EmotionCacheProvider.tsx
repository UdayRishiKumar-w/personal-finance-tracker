import useIsRTL from "@/hooks/useIsRTL";
import createCache, { type StylisPlugin } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";
// eslint-disable-next-line no-restricted-imports
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";

// Create Emotion cache with nonce so MUI styles get CSP-compatible style tags
const scriptWithNonce = document.querySelector("script[nonce]");
const nonce = (scriptWithNonce as HTMLScriptElement)?.nonce;
const insertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');

// https://github.com/emotion-js/emotion/issues/3134
const wrapInLayer: (layerName: string) => StylisPlugin = (layerName) => (node) => {
	// If we're not at the root of a style tag, leave the tree intact
	if (node.parent) return;

	// If we're at the root, replace node with `@layer layerName { node }`
	const child = { ...node, parent: node, root: node };
	Object.assign(node, {
		children: [child],
		length: 6,
		parent: null,
		props: [layerName],
		return: "",
		root: null,
		type: "@layer",
		value: `@layer ${layerName}`,
	});
};

const emotionCacheLTR = createCache({
	key: "mui",
	nonce,
	insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
	stylisPlugins: [prefixer, wrapInLayer("emotion")],
});

const emotionCacheRTL = createCache({
	key: "muirtl",
	nonce,
	insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
	stylisPlugins: [prefixer, wrapInLayer("emotion"), rtlPlugin],
});

const EmotionCacheProvider: FC<PropsWithChildren> = ({ children }) => {
	const isRTL = useIsRTL();

	const muiCache = useMemo(() => {
		return isRTL ? emotionCacheRTL : emotionCacheLTR;
	}, [isRTL]);

	return <CacheProvider value={muiCache}>{children}</CacheProvider>;
};

export default EmotionCacheProvider;
