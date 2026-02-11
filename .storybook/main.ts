import { defineMain } from '@storybook/web-components-vite/node';

export default defineMain({
  framework: '@storybook/web-components-vite',
  stories: ['../stories/**/*.stories.ts'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      css: {
        postcss: {
          plugins: [(await import('tailwindcss')).default, (await import('autoprefixer')).default],
        },
      },
    });
  },
});
