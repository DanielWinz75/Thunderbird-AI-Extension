import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public', // Gibt an, dass der public-Ordner für statische Dateien verwendet wird
  resolve: {
    alias: {
      '@': '/src', // Alias für den src-Ordner
      path: 'path-browserify' // Alias für Node-Umgebung
    },
  },
  build: {
    outDir: 'dist', // Ausgabeverzeichnis für den Build
  },
});