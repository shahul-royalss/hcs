import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Forward API calls to the FastAPI backend (dev server and local preview)
const apiProxy = {
  '/api': {
    target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
    changeOrigin: true,
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
