import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const path = fileURLToPath(new URL(import.meta.url));
const root = resolve(dirname(path));

// https://vitejs.dev/config/
export default defineConfig({
  root,
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [react()],
});
