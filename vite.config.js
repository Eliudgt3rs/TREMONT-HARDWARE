/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server URL
        changeOrigin: true,
        secure: false,
      }
    }
  },
 // base: process.env.VITE_BASE_PATH || '/TREMONT-HARDWARE',
})
