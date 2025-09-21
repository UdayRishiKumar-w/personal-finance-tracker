import { defineConfig, minimal2023Preset as preset } from "@vite-pwa/assets-generator/config";

export default defineConfig({
	headLinkOptions: {
		preset: "2023", // This ensures modern icon generation for all devices
	},
	// Define the icon generation presets (sizes, maskable, etc.)
	preset: {
		...preset,
		transparent: {
			sizes: [64, 192, 512],
			favicons: [
				[32, "favicon-32x32.png"],
				[48, "favicon-48x48.ico"],
				[48, "favicon-48x48.png"],
				[64, "favicon.ico"],
				[96, "favicon-96x96.png"],
				[144, "favicon-144x144.png"],
				[192, "favicon-192x192.png"],
				[256, "favicon-256x256.png"],
			],
		},
		maskable: {
			sizes: [192, 512],
		},
		apple: {
			sizes: [180], // iOS specific icon size
		},
	},

	// Define the source images for generating assets // prefer svg
	images: ["public/favicon.svg"],
});
