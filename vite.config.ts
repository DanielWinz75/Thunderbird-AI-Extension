import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public', // Specifies that the public folder is used for static files
  resolve: {
    alias: {
      path: 'path-browserify' // Alias for Node environment
    },
  },
  build: {
    outDir: 'dist', // Output directory for the build
    sourcemap: true, // Enable source maps
    chunkSizeWarningLimit: 1000, // Warn if chunk size exceeds 1000 KB
  },
});