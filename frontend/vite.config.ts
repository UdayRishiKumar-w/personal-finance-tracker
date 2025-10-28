import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
// import { analyzer } from "vite-bundle-analyzer";
import { imagetools } from "vite-imagetools"; // https://github.com/JonasKruckenberg/imagetools/blob/main/docs/_media/getting-started.md
// import VitePluginChecker from "vite-plugin-checker";
import { devtools } from "@tanstack/devtools-vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import preload from "vite-plugin-preload";
import { VitePWA } from "vite-plugin-pwa";
import removeConsole from "vite-plugin-remove-console";
import { vitePWAOptions } from "./vite-build-config";

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
	const isDev = mode === "development";
	const env = loadEnv(mode, process.cwd(), "");

	return {
		...(env.VITE_NONCE_ENABLED === "true" && {
			html: {
				cspNonce: "NGINX_CSP_NONCE", // Replace with nginx dynamic nonce
			},
		}),
		server: {
			open: isDev,
		},
		plugins: [
			react(),
			tailwindcss(),
			VitePWA(vitePWAOptions),
			imagetools(),
			removeConsole(),
			preload({ mode: "prefetch" }),
			...(isDev ? [devtools()] : []),
			// VitePluginChecker({
			// 	typescript: true, // Enable TypeScript checking
			// 	// eslint: {
			// 	// 	lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"', // Stop the build on ESLint warnings
			// 	// },
			// 	stylelint: {
			// 		lintCommand: 'stylelint "src/**/*.{css,scss,tsx,jsx}"  --max-warnings 0',
			// 	},
			// }),
			// analyzer(),
			ViteMinifyPlugin(),
		],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		build: {
			sourcemap: false,
			minify: "terser",
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (id.includes("i18n")) return "i18n";
							if (id.includes("axios")) return "axios";
							if (id.includes("@mui") || id.includes("@emotion")) {
								return "mui-emotion";
							}
							if (id.includes("react") || id.includes("use-sync-external-store")) return "react";
							if (id.includes("chart.js") || id.includes("chartjs") || id.includes("hammerjs")) {
								return "chartjs";
							}
							if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
								return "redux";
							}
							return "vendor";
						}
					},
				},
			},
		},
		optimizeDeps: {
			include: [
				"react",
				"react-dom",
				"react-router-dom",
				"axios",
				"@mui/material",
				"clsx",
				"@emotion/react",
				"@emotion/styled",
				"react-redux",
				"@reduxjs/toolkit",
				"chart.js",
				"react-chartjs-2",
			],
		},
		css: {
			devSourcemap: true,
		},
		define: {
			"process.env.NODE_ENV": JSON.stringify(mode),
		},
	};
});
