import { __DEV__ } from '../utils/dev.js';
import type { ColorScheme, KnownColorScheme } from './types.js';

/** Compile-time exhaustiveness check: every `KnownColorScheme` must appear. */
const _exhaustive: Record<KnownColorScheme, true> = {
  black: true,
  red: true,
  blue: true,
  green: true,
  yellow: true,
};

const KNOWN_SCHEMES: ReadonlySet<KnownColorScheme> = new Set<KnownColorScheme>(
  Object.keys(_exhaustive) as KnownColorScheme[],
);

export function isKnownScheme(scheme: string): scheme is KnownColorScheme {
  return KNOWN_SCHEMES.has(scheme as KnownColorScheme);
}

export function lookupScheme(map: Record<KnownColorScheme, string>, scheme: KnownColorScheme): string;
export function lookupScheme(
  map: Record<KnownColorScheme, string>,
  scheme: ColorScheme | undefined,
): string | undefined;
export function lookupScheme(
  map: Record<KnownColorScheme, string>,
  scheme: ColorScheme | undefined,
): string | undefined {
  if (!scheme) return;
  if (isKnownScheme(scheme)) return map[scheme];
  if (__DEV__) {
    // biome-ignore lint/suspicious/noConsole: intentional dev-mode warning
    console.warn(`[KarbitUI] Unknown color scheme "${scheme}"`);
  }
  return;
}

export const INTERACTIVE_SOLID: Record<KnownColorScheme, string> = {
  black:
    'bg-gray-900 border-gray-900 text-white hover:bg-gray-800 hover:border-gray-800 active:bg-black active:border-black dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:hover:border-zinc-300 dark:active:bg-zinc-400 dark:active:border-zinc-400',
  red: 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 active:bg-red-700 active:border-red-700 dark:bg-red-600 dark:border-red-600 dark:hover:bg-red-500 dark:hover:border-red-500 dark:active:bg-red-700 dark:active:border-red-700',
  blue: 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 active:border-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:active:bg-blue-700 dark:active:border-blue-700',
  green:
    'bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600 active:bg-green-700 active:border-green-700 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-500 dark:hover:border-green-500 dark:active:bg-green-700 dark:active:border-green-700',
  yellow:
    'bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-600 hover:border-yellow-600 active:bg-yellow-700 active:border-yellow-700 dark:bg-yellow-500 dark:border-yellow-500 dark:text-black dark:hover:bg-yellow-400 dark:hover:border-yellow-400 dark:active:bg-yellow-600 dark:active:border-yellow-600',
} as const satisfies Record<KnownColorScheme, string>;

export const INTERACTIVE_OUTLINE: Record<KnownColorScheme, string> = {
  black:
    'bg-white text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white active:bg-black dark:bg-transparent dark:text-zinc-100 dark:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 dark:active:bg-zinc-300',
  red: 'bg-white text-red-600 border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 dark:bg-transparent dark:text-red-400 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:active:bg-red-600',
  blue: 'bg-white text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 dark:bg-transparent dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:active:bg-blue-600',
  green:
    'bg-white text-green-600 border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 dark:bg-transparent dark:text-green-400 dark:border-green-500 dark:hover:bg-green-500 dark:hover:text-white dark:active:bg-green-600',
  yellow:
    'bg-white text-yellow-600 border-yellow-500 hover:bg-yellow-500 hover:text-black active:bg-yellow-600 dark:bg-transparent dark:text-yellow-400 dark:border-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-black dark:active:bg-yellow-600',
} as const satisfies Record<KnownColorScheme, string>;

export const INTERACTIVE_GHOST: Record<KnownColorScheme, string> = {
  black:
    'bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  red: 'bg-transparent text-red-600 hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-950 dark:active:bg-red-900',
  blue: 'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-950 dark:active:bg-blue-900',
  green:
    'bg-transparent text-green-600 hover:bg-green-50 active:bg-green-100 dark:text-green-400 dark:hover:bg-green-950 dark:active:bg-green-900',
  yellow:
    'bg-transparent text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-950 dark:active:bg-yellow-900',
} as const satisfies Record<KnownColorScheme, string>;

export const INTERACTIVE_LINK: Record<KnownColorScheme, string> = {
  black:
    'bg-transparent text-gray-900 decoration-gray-900/40 hover:decoration-gray-900 dark:text-zinc-100 dark:decoration-zinc-100/40 dark:hover:decoration-zinc-100',
  red: 'bg-transparent text-red-500 decoration-red-500/40 hover:decoration-red-500 hover:text-red-600 dark:text-red-400 dark:decoration-red-400/40 dark:hover:decoration-red-400 dark:hover:text-red-300',
  blue: 'bg-transparent text-blue-500 decoration-blue-500/40 hover:decoration-blue-500 hover:text-blue-600 dark:text-blue-400 dark:decoration-blue-400/40 dark:hover:decoration-blue-400 dark:hover:text-blue-300',
  green:
    'bg-transparent text-green-500 decoration-green-500/40 hover:decoration-green-500 hover:text-green-600 dark:text-green-400 dark:decoration-green-400/40 dark:hover:decoration-green-400 dark:hover:text-green-300',
  yellow:
    'bg-transparent text-yellow-500 decoration-yellow-500/40 hover:decoration-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:decoration-yellow-400/40 dark:hover:decoration-yellow-400 dark:hover:text-yellow-300',
} as const satisfies Record<KnownColorScheme, string>;

export const STATIC_SOLID: Record<KnownColorScheme, string> = {
  black: 'bg-gray-900 border-gray-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900',
  red: 'bg-red-500 border-red-500 text-white dark:bg-red-600 dark:border-red-600',
  blue: 'bg-blue-500 border-blue-500 text-white dark:bg-blue-600 dark:border-blue-600',
  green: 'bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600',
  yellow: 'bg-yellow-500 border-yellow-500 text-black dark:bg-yellow-500 dark:border-yellow-500 dark:text-black',
} as const satisfies Record<KnownColorScheme, string>;

export const STATIC_OUTLINE: Record<KnownColorScheme, string> = {
  black: 'border-gray-900 text-gray-900 dark:border-zinc-100 dark:text-zinc-100',
  red: 'border-red-500 text-red-700 dark:border-red-400 dark:text-red-400',
  blue: 'border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-400',
  green: 'border-green-500 text-green-700 dark:border-green-400 dark:text-green-400',
  yellow: 'border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-400',
} as const satisfies Record<KnownColorScheme, string>;

export const STATIC_SUBTLE: Record<KnownColorScheme, string> = {
  black: 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
} as const satisfies Record<KnownColorScheme, string>;

export const BG_COLOR: Record<KnownColorScheme, string> = {
  black: 'bg-gray-900 dark:bg-zinc-100',
  red: 'bg-red-500 dark:bg-red-400',
  blue: 'bg-blue-500 dark:bg-blue-400',
  green: 'bg-green-500 dark:bg-green-400',
  yellow: 'bg-yellow-500 dark:bg-yellow-400',
} as const satisfies Record<KnownColorScheme, string>;

export const BORDER_COLOR: Record<KnownColorScheme, string> = {
  black: 'border-gray-900 dark:border-zinc-100',
  red: 'border-red-500 dark:border-red-400',
  blue: 'border-blue-500 dark:border-blue-400',
  green: 'border-green-500 dark:border-green-400',
  yellow: 'border-yellow-500 dark:border-yellow-400',
} as const satisfies Record<KnownColorScheme, string>;

export const BG_COLOR_PING: Record<KnownColorScheme, string> = {
  black: 'bg-gray-900/75 dark:bg-zinc-100/75',
  red: 'bg-red-500/75 dark:bg-red-400/75',
  blue: 'bg-blue-500/75 dark:bg-blue-400/75',
  green: 'bg-green-500/75 dark:bg-green-400/75',
  yellow: 'bg-yellow-500/75 dark:bg-yellow-400/75',
} as const satisfies Record<KnownColorScheme, string>;
