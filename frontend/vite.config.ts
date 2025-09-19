import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools"; // https://github.com/JonasKruckenberg/imagetools/blob/main/docs/_media/getting-started.md
import cdn from "vite-plugin-cdn-import";
import VitePluginChecker from "vite-plugin-checker";
import preload from "vite-plugin-preload";
import { VitePWA } from "vite-plugin-pwa";
import removeConsole from "vite-plugin-remove-console";

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: false, //'script-defer'

			includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "icons/apple-icon-180.png"],
			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: "Personal Finance Tracker",
				short_name: "PFT",
				description: "Personal Finance Tracker Web App",
				theme_color: "#1e40af",
				background_color: "#ffffff",
				display: "standalone",
				scope: "/",
				start_url: "/",
				icons: [
					{
						src: "favicon.ico",
						sizes: "64x64 32x32 24x24 16x16",
						type: "image/x-icon",
						purpose: ["any", "maskable"],
					},
					{
						src: "icons/manifest-icon-192.maskable.png",
						sizes: "192x192",
						type: "image/png",
						purpose: ["any", "maskable"],
					},
					{
						src: "icons/manifest-icon-512.maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: ["any", "maskable"],
					},
				],
			},

			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
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
				],
			},

			devOptions: {
				enabled: true,
				navigateFallback: "index.html",
				suppressWarnings: true,
				type: "module",
			},
		}),
		imagetools(),
		removeConsole(),
		preload(),
		cdn({
			modules: ["react", "react-dom", "react-router-dom", "axios"],
		}), //Default: https://cdn.jsdelivr.net/npm/{name}@{version}/{path},
		VitePluginChecker({
			typescript: true, // Enable TypeScript checking
			// eslint: {
			// 	lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"', // Stop the build on ESLint warnings
			// },
			stylelint: {
				lintCommand: 'stylelint "src/**/*.{css,scss,tsx,jsx}"  --max-warnings 0',
			},
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	css: {
		devSourcemap: true,
	},
});
