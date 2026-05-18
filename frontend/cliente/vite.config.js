import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Aceita conexões de qualquer IP (incluindo celular)
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Usar esbuild em vez de terser (mais rápido e sem dependência extra)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks para melhor cache
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'axios-vendor': ['axios']
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500
  },
  // Optimizações de performance
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  }
});
