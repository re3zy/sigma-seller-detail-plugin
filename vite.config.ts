import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    // Remove the https: true line
  },
  build: {
    sourcemap: true,
  }
})