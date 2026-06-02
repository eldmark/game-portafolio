import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  cacheDir: process.env.VITE_CACHE_DIR,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/')
          ) {
            return 'react-vendor';
          }

          if (
            id.includes('/three/') ||
            id.includes('/@react-three/fiber/') ||
            id.includes('/@react-three/drei/')
          ) {
            return 'three-vendor';
          }

          if (id.includes('/framer-motion/')) {
            return 'motion-vendor';
          }

          if (id.includes('/lucide-react/')) {
            return 'icons-vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
