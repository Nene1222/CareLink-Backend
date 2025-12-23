import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),],
  optimizeDeps: {
    include: ['lucide-react'],
    // exclude: [],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // backend
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    // Add this line to allow your ngrok host
    // allowedHosts: ["ungummed-metabiotically-maxwell.ngrok-free.dev"],
  },
});
