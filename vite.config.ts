import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mix from 'vite-plugin-mix'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext"
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [react(), mix({
    handler: './api.js',
  })],
})
