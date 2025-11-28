import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './website',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './website')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

