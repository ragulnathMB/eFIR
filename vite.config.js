import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/register': 'http://localhost:5000',  // Adjust the API endpoint for your signup route
      '/login': 'http://localhost:5000',   // Similarly for other routes like login
      // Add more API routes as needed
    },
  },
})
