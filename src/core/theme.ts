export const theme = {
  colors: {
    accent: { DEFAULT: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
    surface: {
      light: '#ffffff',
      muted: '#f8f9fa',
      dark: '#18181b',
      darkMuted: '#27272a',
    },
    border: { light: '#e5e7eb', dark: '#3f3f46' },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      muted: '#94a3b8',
      ghost: '#e2e8f0',
    },
    status: {
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    },
  },

  borders: {
    width: '1px',
    style: 'solid',
    colorLight: '#e5e7eb',
    colorDark: '#3f3f46',
  },

  radii: {
    none: '0px',
  },

  fonts: {
    sans: '"Plus Jakarta Sans", Inter, system-ui, -apple-system, sans-serif',
    mono: '"IBM Plex Mono", "JetBrains Mono", "Fira Code", monospace',
    body: '"Plus Jakarta Sans", Inter, system-ui, -apple-system, sans-serif',
    heading: '"Plus Jakarta Sans", Inter, system-ui, -apple-system, sans-serif',
  },

  transitions: {
    default: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Theme = typeof theme;

/** Shared utility class fragments for the minimal-brutalist design system. */
export const kbClasses = {
  border: 'border border-gray-200 dark:border-zinc-700',
  borderBottom: 'border-b border-gray-200 dark:border-zinc-700',
  borderTop: 'border-t border-gray-200 dark:border-zinc-700',
  surface: 'bg-white dark:bg-zinc-900',
  surfaceMuted: 'bg-gray-50 dark:bg-zinc-800',
  textPrimary: 'text-slate-900 dark:text-zinc-50',
  textSecondary: 'text-slate-500 dark:text-zinc-400',
  textMuted: 'text-slate-400 dark:text-zinc-500',
  label: 'font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-zinc-400',
  focus: 'focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2',
  disabled: 'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
  transition: 'transition-all duration-150 ease-in-out',
} as const;

export type KbClasses = typeof kbClasses;
