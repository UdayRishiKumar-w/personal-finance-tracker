import { languageOptions } from "@/Constants";
import type { ThemeMode } from "@/types/globalTypes";
import createCache, { type StylisPlugin } from "@emotion/cache";
// eslint-disable-next-line no-restricted-imports
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";

export const getLangSupported = (lang: string): (typeof languageOptions)[number]["code"] => {
	const langSupported = languageOptions.find(({ code }) => lang === code || lang.startsWith(`${code}-`));

	return langSupported ? langSupported.code : "en";
};

export const getInitialTheme = (): ThemeMode => {
	const storedPreference = localStorage.getItem("theme");
	if (storedPreference && (storedPreference === "light" || storedPreference === "dark")) {
		document.documentElement.classList.toggle("dark", storedPreference === "dark");
		return storedPreference;
	}

	const prefersDarkMode = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
	const preferMode = prefersDarkMode ? "dark" : "light";
	document.documentElement.classList.toggle("dark", prefersDarkMode);
	localStorage.setItem("theme", preferMode);
	return preferMode;
};

// Create Emotion cache with nonce so MUI styles get CSP-compatible style tags
const scriptWithNonce = document.querySelector("script[nonce]");
const nonce = (scriptWithNonce as HTMLScriptElement)?.nonce;
const insertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');

// https://github.com/emotion-js/emotion/issues/3134
const wrapInLayer: (layerName: string) => StylisPlugin = (layerName) => (node) => {
	// if we're not at the root of a <style> tag, leave the tree intact
	if (node.parent) return;

	// if we're at the root, replace node with `@layer layerName { node }`
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

export const emotionCacheLTR = createCache({
	key: "mui",
	nonce,
	insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
	stylisPlugins: [prefixer, wrapInLayer("emotion")],
});

export const emotionCacheRTL = createCache({
	key: "muirtl",
	nonce,
	insertionPoint: (insertionPoint as HTMLElement) ?? undefined,
	stylisPlugins: [prefixer, wrapInLayer("emotion"), rtlPlugin],
});
