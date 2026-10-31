import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    // URL pathname instead of node:url's fileURLToPath, so the app's tsconfig needs no Node types.
    alias: { '@': decodeURIComponent(new URL('./src', import.meta.url).pathname) },
  },
  server: {
    // Proxy API calls to the DRF dev server so the browser sees one origin.
    proxy: { '/api': 'http://localhost:8000' },
  },
})
