import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The inference worker code-splits (WASM vs WebGPU runtimes), which needs ES module workers.
  worker: { format: 'es' },
  // Pre-bundling would break the runtime's relative .wasm URLs in dev.
  optimizeDeps: { exclude: ['onnxruntime-web'] },
  // Two pages: the portfolio and the satellite super-resolution case study.
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        satelliteSr: resolve(__dirname, 'reports/satellite-sr/index.html'),
      },
    },
  },
})
