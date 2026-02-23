/**
 * Karbit UI design tokens.
 *
 * In Tailwind v4, theming is configured via CSS (@theme) rather than a JS
 * preset. This file exports the raw token values so consumers can reference
 * them in TypeScript (e.g. for CSS-in-JS, style attributes, or tests).
 *
 * For Tailwind v4 configuration, import the CSS file instead:
 *   @import "@wearesyntesa/karbit-ui/tailwind.css";
 */

export const tokens = {
  darkMode: 'class' as const,

  borderRadius: '0px',

  borderWidth: '1px',

  fontFamily: {
    sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['"IBM Plex Mono"', '"JetBrains Mono"', '"Fira Code"', 'monospace'],
  },

  colors: {
    accent: {
      DEFAULT: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    surface: {
      light: '#ffffff',
      muted: '#f8f9fa',
      dark: '#18181b',
      'dark-muted': '#27272a',
    },
    border: {
      light: '#e5e7eb',
      dark: '#3f3f46',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      muted: '#94a3b8',
      ghost: '#e2e8f0',
      'dark-primary': '#fafafa',
      'dark-secondary': '#a1a1aa',
      'dark-muted': '#71717a',
      'dark-ghost': '#27272a',
    },
  },

  animation: {
    'kb-fade-in': 'kb-fade-in 150ms ease-out',
    'kb-fade-in-fast': 'kb-fade-in 100ms ease-out',
    'kb-slide-in-right': 'kb-slide-in-right 200ms cubic-bezier(0.2, 0, 0, 1)',
    'kb-slide-in-left': 'kb-slide-in-left 200ms cubic-bezier(0.2, 0, 0, 1)',
    'kb-slide-in-down': 'kb-slide-in-down 200ms cubic-bezier(0.2, 0, 0, 1)',
    'kb-slide-in-up': 'kb-slide-in-up 200ms cubic-bezier(0.2, 0, 0, 1)',
    'kb-progress-indeterminate': 'kb-progress-indeterminate 1.5s ease-in-out infinite',
    'kb-progress-fill': 'kb-progress-fill 500ms ease-out forwards',
    'kb-progress-stripes': 'kb-progress-stripes 0.6s linear infinite',
    'kb-spinner-bounce': 'kb-spinner-bounce 1.4s ease-in-out infinite',
    'kb-spinner-bar': 'kb-spinner-bar 1.2s ease-in-out infinite',
    'kb-spinner-pulse': 'kb-spinner-pulse 1.5s ease-in-out infinite',
    'kb-check-draw': 'kb-check-draw 200ms ease-out forwards',
    'kb-radio-pop': 'kb-radio-pop 200ms ease-out forwards',
    'kb-pop-bottom': 'kb-pop-bottom 100ms ease-out',
    'kb-pop-top': 'kb-pop-top 100ms ease-out',
    'kb-pop-left': 'kb-pop-left 100ms ease-out',
    'kb-pop-right': 'kb-pop-right 100ms ease-out',
  },
} as const;

export type KarbitTokens = typeof tokens;

export default tokens;
