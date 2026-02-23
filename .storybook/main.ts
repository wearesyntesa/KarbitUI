import { defineMain } from '@storybook/web-components-vite/node';

export default defineMain({
  framework: '@storybook/web-components-vite',
  stories: ['../stories/**/*.stories.ts'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const tailwindcss = (await import('tailwindcss')).default;
    const autoprefixer = (await import('autoprefixer')).default;
    const karbitPreset = (await import('../tailwind.config.ts')).default;
    return mergeConfig(config, {
      css: {
        postcss: {
          plugins: [
            tailwindcss({
              config: {
                presets: [karbitPreset],
                content: ['./src/**/*.ts', './stories/**/*.ts'],
              },
            }),
            autoprefixer,
          ],
        },
      },
    });
  },
});
