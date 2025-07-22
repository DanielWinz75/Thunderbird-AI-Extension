import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';

function getTsEntries() {
  const files = globSync('src/**/*.ts');
  const entries: Record<string, string> = {};
  for (const file of files) {
    // Entferne src/ und .ts für den Namen
    const name = file.split('/').pop()?.replace(/\.ts$/, '');

    console.log(`Processing file: ${file}, entry name: ${name}`);

    //entries[name] = resolve(__dirname, file);
  }
  return entries;
}

export default defineConfig({
  resolve: {
    alias: {
      path: 'path-browserify'
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'displ-email-and-promptfield.html'),
        ...getTsEntries()
      },
      output: {
        entryFileNames: 'assets/[name].js'
      }
    },
    target: 'es2020',
  },
});
