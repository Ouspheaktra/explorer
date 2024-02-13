import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:5000",
      "/file": "http://localhost:5000",
      "/thumbnail": "http://localhost:5000",
    }
  }
})
