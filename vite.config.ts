import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Ensure this says @vitejs/plugin-vue
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // This tells Vite that @ = the src folder
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})