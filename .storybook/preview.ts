import type { Preview } from '@storybook/web-components-vite';
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import { html } from 'lit';

import customElements from '../custom-elements.json';
import './storybook.css';

setCustomElementsManifest(customElements);

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Light or dark mode',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (story, context) => {
      const theme = (context.globals['theme'] as string) || 'light';
      const isDark = theme === 'dark';

      // Sync dark class on <html> — Storybook may add its own, so we override explicitly
      document.documentElement.classList.toggle('dark', isDark);

      const bg = isDark ? '#18181b' : '#ffffff';
      const text = isDark ? '#fafafa' : '#0f172a';

      return html`
        <div
          style="background:${bg};color:${text};min-height:100vh;padding:1.5rem;"
        >
          ${story()}
        </div>
      `;
    },
  ],
};

export default preview;
