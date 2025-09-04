import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2525,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      port: 2525,
      host: 'localhost'
    },
    cors: true,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})