import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    exclude: ["@vite/client", "@vite/env"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [
    react(),
    // VitePWA({
    //   workbox: {
    //     globPatterns: [
    //       "**/*.js",
    //       "**/*.css",
    //       "**/*.svg",
    //       "**/*.html",
    //       "**/*.png",
    //       "**/*.wasm",
    //     ],
    //   },
    // }),
  ],
  server: {
    fs: {
      strict: false,
    },
  },
});
