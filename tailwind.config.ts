import type { Config } from 'tailwindcss';

const karbitPreset: Config = {
  content: [
    './src/**/*.ts',
    './stories/**/*.ts',
  ],
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
        'kb-scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
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
          from: { width: '100%' },
          to: { width: '0%' },
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
      },
      animation: {
        'kb-fade-in': 'kb-fade-in 150ms ease-out',
        'kb-scale-in': 'kb-scale-in 150ms ease-out',
        'kb-slide-in-right': 'kb-slide-in-right 200ms ease-out',
        'kb-slide-in-left': 'kb-slide-in-left 200ms ease-out',
        'kb-slide-in-down': 'kb-slide-in-down 200ms ease-out',
        'kb-slide-in-up': 'kb-slide-in-up 200ms ease-out',
        'kb-progress-indeterminate': 'kb-progress-indeterminate 1.5s ease-in-out infinite',
        'kb-progress-stripes': 'kb-progress-stripes 0.6s linear infinite',
        'kb-spinner-bounce': 'kb-spinner-bounce 1.4s ease-in-out infinite',
        'kb-spinner-bar': 'kb-spinner-bar 1.2s ease-in-out infinite',
        'kb-spinner-pulse': 'kb-spinner-pulse 1.5s ease-in-out infinite',
        'kb-check-draw': 'kb-check-draw 200ms ease-out forwards',
        'kb-radio-pop': 'kb-radio-pop 200ms ease-out forwards',
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
  plugins: [],
};

export default karbitPreset;
