import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

interface PluginContext {
  emitFile: (options: { type: 'asset'; fileName: string; source: string }) => void;
}

/**
 * Custom Vite plugin to extract the @layer theme block from the generated theme.css.
 * Tailwind v4 outputs all design tokens inside an @layer theme { :root, :host { ... } } block.
 * This plugin extracts that block, strips the @layer wrapper, and emits just the
 * :root, :host { ... } block as theme.tokens.css.
 */
function extractThemeTokensPlugin(): Plugin {
  return {
    name: 'extract-theme-tokens',
    generateBundle(_: unknown, bundle: Record<string, unknown>): void {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        // biome-ignore lint/suspicious/noExplicitAny: Vite chunk structure
        const assetChunk = chunk as any;
        if (fileName === 'theme.css' && assetChunk.type === 'asset' && typeof assetChunk.source === 'string') {
          // biome-ignore lint/suspicious/noExplicitAny: Rollup plugin context
          extractTokensFromCss(assetChunk.source, this as any);
        }
      }
    },
  };
}

function extractTokensFromCss(css: string, ctx: PluginContext): void {
  const startIdx = css.indexOf('@layer theme{');
  if (startIdx === -1) {
    return;
  }

  let braceCount = 0;
  let endIdx = -1;

  for (let i = startIdx + '@layer theme'.length; i < css.length; i++) {
    if (css[i] === '{') braceCount++;
    if (css[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx !== -1) {
    const innerContent = css.substring(startIdx + '@layer theme{'.length, endIdx);
    ctx.emitFile({
      type: 'asset',
      fileName: 'theme.tokens.css',
      source: `/* KarbitUI Design Tokens */\n${innerContent}\n`,
    });
  }
}

/**
 * Separate build config that processes src/theme.css through PostCSS/Tailwind
 * and outputs a self-contained dist/theme.css for consumers to import.
 *
 * Run via: vite build --config vite.config.css.ts
 */
export default defineConfig({
  build: {
    // Write output alongside the JS dist files
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/theme.css'),
      output: {
        // Place the processed CSS at dist/theme.css (no hashing)
        assetFileNames: '[name][extname]',
      },
    },
  },
  plugins: [extractThemeTokensPlugin()],
});
