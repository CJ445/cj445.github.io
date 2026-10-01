import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { buildAgentMarkdown } from './src/data/agentMarkdown.ts'

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Agent mode for crawlers that never run JavaScript: the same markdown the page shows is emitted as /agent.md
// and embedded in index.html, so a plain HTTP fetch of either one returns the whole portfolio.
const agentMarkdown = (): Plugin => ({
  name: 'agent-markdown',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'agent.md', source: buildAgentMarkdown() })
  },
  transformIndexHtml: {
    order: 'pre',
    handler(html, ctx) {
      if (ctx.path !== '/index.html') return html
      const fallback = `<noscript><pre id="agent-md">${escapeHtml(buildAgentMarkdown())}</pre></noscript>`
      return html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${fallback}`)
    },
  },
})


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), agentMarkdown()],
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
