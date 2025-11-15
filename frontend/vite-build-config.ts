import type { ManifestOptions, VitePWAOptions } from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
	name: "Personal Finance Tracker",
	short_name: "PFT",
	description: "Personal Finance Tracker Web App",
	theme_color: "#1e40af",
	background_color: "#ffffff",
	display: "standalone",
	orientation: "any",
	scope: "/",
	start_url: "/",
	icons: [
		{
			src: "favicon.ico",
			sizes: "64x64",
			type: "image/x-icon",
			purpose: "any",
		},
		{
			src: "favicon.ico",
			sizes: "64x64",
			type: "image/x-icon",
			purpose: "maskable",
		},
		{
			src: "android-64x64.png", // replace pwa- with android-
			sizes: "64x64",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "android-192x192.png",
			sizes: "192x192",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "android-256x256.png",
			sizes: "256x256",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "android-512x512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "icons/manifest-icon-192.maskable.png",
			sizes: "192x192",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "icons/manifest-icon-192.maskable.png",
			sizes: "192x192",
			type: "image/png",
			purpose: "maskable",
		},
		{
			src: "icons/manifest-icon-512.maskable.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "icons/manifest-icon-512.maskable.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "maskable",
		},
	],
	screenshots: [
		{
			src: "images/mobile.png",
			type: "image/png",
			sizes: "750x1334",
			form_factor: "narrow",
		},
		{
			src: "images/desktop.png",
			type: "image/png",
			sizes: "1918x870",
			form_factor: "wide",
		},
	],
};

export const vitePWAOptions: Partial<VitePWAOptions> = {
	registerType: "autoUpdate",
	injectRegister: "script-defer",

	includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "icons/apple-icon-180.png"],
	pwaAssets: {
		disabled: false,
		config: true,
	},

	manifest,

	workbox: {
		globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,json,txt}"],
		cleanupOutdatedCaches: true,
		clientsClaim: true,
		// skipWaiting: true, // Force activate new service worker immediately
		cacheId: "pft",
		navigationPreload: true,
		sourcemap: false,
		runtimeCaching: [
			{
				urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
				handler: "CacheFirst",
				options: {
					cacheName: "google-fonts-stylesheets",
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
				handler: "CacheFirst",
				options: {
					cacheName: "google-fonts-webfonts",
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
				handler: "CacheFirst",
				options: {
					cacheName: "jsdelivr-cdn-js-files",
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
				handler: "CacheFirst",
				options: {
					cacheName: "cdnjs-cdn-js-files",
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: /^\/api\//,
				handler: "NetworkOnly",
				options: {
					cacheName: "api-calls",
				},
			},
		],
		navigateFallback: "/index.html",
		navigateFallbackAllowlist: [
			/^\/(?!api).*/, // allow ALL navigations except those starting with /api
		],
	},

	devOptions: {
		enabled: false,
		navigateFallback: "index.html",
		suppressWarnings: true,
		type: "module",
	},
};
