import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '',
  server: {
    proxy: {
      '/init': 'http://localhost:8600',
      '/socket.io': {
        target: 'ws://localhost:8600',
        ws: true,
      },
    }
  }
})
