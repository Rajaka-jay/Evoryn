import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Evoryn/',           // ← Keep this (repo name + trailing slash)
  plugins: [
    vue(),
    tailwindcss(),
  ],
  build: {
    assetsDir: 'assets',      // Make sure assets folder is named correctly
  }
})