import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import solidjs from "vite-plugin-solid";
import { resolve } from "node:path";
import fs from "node:fs";

export default defineConfig({
	plugins: [solidjs(), vanillaExtractPlugin()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	server: {
		https: {
			key: fs.readFileSync("../config/localhost-key.pem"),
			cert: fs.readFileSync("../config/localhost.pem"),
			ca: fs.readFileSync("../config/rootCA.pem"),
		},
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
