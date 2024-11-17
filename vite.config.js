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
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        // fileURLToPath(
        //   new URL(
        //     './src/app.config.js',
        //     import.meta.url
        //   )
        // ),
        
      ]
    }
  }
})
