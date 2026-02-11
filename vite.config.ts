import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      outDir: 'dist',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'core/theme': resolve(__dirname, 'src/core/theme.ts'),
        'core/recipe': resolve(__dirname, 'src/core/recipe.ts'),
        'utils/cx': resolve(__dirname, 'src/utils/cx.ts'),
        'react/index': resolve(__dirname, 'src/react/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['lit', 'lit/decorators.js', 'lit/directives/unsafe-html.js', '@lit/react', 'react'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
    target: 'ES2021',
    minify: false,
    sourcemap: true,
  },
});
