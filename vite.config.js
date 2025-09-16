// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' }, // optional: import from '@/...' instead of relative paths
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 5173,
  },
})
