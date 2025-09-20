import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
// import { analyzer } from "vite-bundle-analyzer";
import { imagetools } from "vite-imagetools"; // https://github.com/JonasKruckenberg/imagetools/blob/main/docs/_media/getting-started.md
import cdn from "vite-plugin-cdn-import";
import VitePluginChecker from "vite-plugin-checker";
import preload from "vite-plugin-preload";
import { VitePWA } from "vite-plugin-pwa";
import removeConsole from "vite-plugin-remove-console";

const sriHashes: Record<string, string> = {
	react: "sha512-Fpy3gN6679IxNCKdpQGYyYF/QoXTWctUB5jtb+DipQXBLFzkzCrTbNlZPT3rcuc7ARVPLAQtmFyNOx0h5/7MVA==",
	"react-dom": "sha512-iTbBPaHNYnlkn+GZ8cJWUJyqcxL49EbnNehu1fA7lcTaucWjtdFfj1F6qQwaGmCQRBOX1vSU8+4EC8aE+I70Ug==",
	"react-router-dom": "",
	axios: "sha256-9UiRtJ3cNB91qdVSArvgPVFvPO84K24aze2J0b7NKu0=",
};

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
	const isDev = mode === "development";
	//   const env = loadEnv(mode, process.cwd(), '');
	return {
		server: {
			open: isDev,
		},
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
							purpose: "any",
						},
						{
							src: "favicon.ico",
							sizes: "64x64 32x32 24x24 16x16",
							type: "image/x-icon",
							purpose: "maskable",
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
				generateScriptTag: (name, scriptUrl) => {
					return {
						attrs: {
							src: scriptUrl,
							defer: true,
							crossorigin: "anonymous",
							referrerpolicy: "no-referrer",
							integrity: sriHashes[name] || "", // optional map of SRI hashes
						},
					};
				},
				modules: [
					{
						name: "react",
						var: "React",
						path: "https://cdnjs.cloudflare.com/ajax/libs/react/19.1.1/cjs/react.production.min.js",
					},
					{
						name: "react-dom",
						var: "ReactDOM",
						path: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/19.1.1/cjs/react-dom.production.min.js",
						alias: ["react-dom/client"],
					},
					{
						name: "react-router-dom",
						var: "ReactRouterDOM",
						path: "https://cdn.jsdelivr.net/npm/react-router-dom@7.9.1/dist/index.min.js",
					},
					{
						name: "axios",
						var: "axios",
						path: "https://cdn.jsdelivr.net/npm/axios@1.12.2/dist/axios.min.js",
					},
				],
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
			// analyzer(),
		],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		build: {
			sourcemap: isDev,
			rollupOptions: {
				external: ["react", "react-dom", "react-router-dom", "axios"],
				output: {
					globals: {
						react: "React",
						"react-dom": "ReactDOM",
						"react-router-dom": "ReactRouterDOM",
						axios: "axios",
					},
					// manualChunks(id) {
					// 	if (id.includes("node_modules")) {
					// 		if (id.includes("@mui") || id.includes("@emotion")) {
					// 			return "mui-emotion";
					// 		}
					// 		if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
					// 			return "chartjs";
					// 		}
					// 		if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
					// 			return "redux";
					// 		}
					// 		return "vendor";
					// 	}
					// },
				},
			},
		},
		optimizeDeps: {
			include: [
				"react",
				"react-dom",
				"axios",
				"@mui/material",
				"clsx",
				"react-router-dom",
				"@emotion/react",
				"@emotion/styled",
			],
		},
		css: {
			devSourcemap: true,
		},
	};
});
