import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [react(), tailwindcss()],
});
