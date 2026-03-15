import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
        detail: resolve(__dirname, 'src/pages/detail.html')
      }
    }
  },
  css: {
    devSourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
});
