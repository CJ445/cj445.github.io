import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The inference worker code-splits (WASM vs WebGPU runtimes), which needs ES module workers.
  worker: { format: 'es' },
  // Pre-bundling would break the runtime's relative .wasm URLs in dev.
  optimizeDeps: { exclude: ['onnxruntime-web'] },
})
