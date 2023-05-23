import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
  },
});
