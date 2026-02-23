import type { Config } from 'tailwindcss';

const karbitPreset: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      keyframes: {
        'kb-fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'kb-slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'kb-slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'kb-slide-in-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'kb-slide-in-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'kb-progress-indeterminate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        'kb-progress-fill': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(var(--kb-progress-scale, 1))' },
        },
        'kb-progress-stripes': {
          from: { backgroundPosition: '1rem 0' },
          to: { backgroundPosition: '0 0' },
        },
        'kb-spinner-bounce': {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-50%)' },
        },
        'kb-spinner-bar': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'kb-spinner-pulse': {
          '0%, 100%': { transform: 'scale(0.85)', opacity: '0.4' },
          '50%': { transform: 'scale(1)', opacity: '1' },
        },
        'kb-toast-countdown': {
          from: { transform: 'scaleX(1)' },
          to: { transform: 'scaleX(0)' },
        },
        'kb-check-draw': {
          from: { strokeDashoffset: '24' },
          to: { strokeDashoffset: '0' },
        },
        'kb-radio-pop': {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        'kb-pop-bottom': {
          from: { opacity: '0', translate: '0 -6px' },
          to: { opacity: '1', translate: '0 0' },
        },
        'kb-pop-top': {
          from: { opacity: '0', translate: '0 6px' },
          to: { opacity: '1', translate: '0 0' },
        },
        'kb-pop-left': {
          from: { opacity: '0', translate: '6px 0' },
          to: { opacity: '1', translate: '0 0' },
        },
        'kb-pop-right': {
          from: { opacity: '0', translate: '-6px 0' },
          to: { opacity: '1', translate: '0 0' },
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
      colors: {
        kb: {
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
      },
    },
  },
  plugins: [
    // biome-ignore lint/suspicious/noExplicitAny: Tailwind plugin API uses broad any for CSS rule values
    ({ addBase }: { addBase: (styles: Record<string, any>) => void }): void => {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '.animate-kb-fade-in, .animate-kb-fade-in-fast, .animate-kb-slide-in-right, .animate-kb-slide-in-left, .animate-kb-slide-in-down, .animate-kb-slide-in-up, .animate-kb-progress-fill, .animate-kb-check-draw, .animate-kb-radio-pop, .animate-kb-pop-bottom, .animate-kb-pop-top, .animate-kb-pop-left, .animate-kb-pop-right':
            { 'animation-duration': '0.01ms', 'animation-iteration-count': '1' },
          '.animate-kb-progress-indeterminate, .animate-kb-progress-stripes, .animate-kb-spinner-bounce, .animate-kb-spinner-bar, .animate-kb-spinner-pulse, .animate-kb-toast-countdown':
            { 'animation-duration': '0.01ms', 'animation-iteration-count': '1' },
        },
      });
    },
  ],
};

export default karbitPreset;
