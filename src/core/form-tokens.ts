import { html, type TemplateResult } from 'lit';
import { kbClasses } from './theme.js';
import type { ComponentSize, KnownColorScheme } from './types.js';

/** Shared variant type for form field wrappers (kb-input, kb-textarea, kb-select). */
export type FormVariant = 'outline' | 'filled' | 'flushed';

/** Wrapper border/bg classes per variant. */
export const VARIANT_WRAPPER: Record<FormVariant, string> = {
  outline: `bg-white border ${kbClasses.borderColor} dark:bg-transparent hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:hover:border-blue-500 dark:focus-within:hover:border-blue-400`,
  filled:
    'bg-gray-100 border border-gray-100 hover:bg-gray-200/60 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-700 focus-within:bg-white focus-within:border-gray-300 dark:focus-within:bg-transparent dark:focus-within:border-zinc-600',
  flushed: `bg-transparent border-b ${kbClasses.borderColor} hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400`,
} as const satisfies Record<FormVariant, string>;

/** Red border overrides for invalid state per variant. */
export const VARIANT_WRAPPER_INVALID: Record<FormVariant, string> = {
  outline:
    'border-red-500 dark:border-red-500 hover:border-red-500 dark:hover:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
  filled: 'border-red-500 dark:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
  flushed:
    'border-red-500 dark:border-red-500 hover:border-red-500 dark:hover:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
} as const satisfies Record<FormVariant, string>;

/** Horizontal + vertical padding per size. */
export const SIZE_PADDING: Record<ComponentSize, string> = {
  xs: 'px-2 py-1',
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
  xl: 'px-6 py-4',
} as const satisfies Record<ComponentSize, string>;

/** Font size per component size. */
export const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const satisfies Record<ComponentSize, string>;

/** Slotted SVG icon dimensions per size (child selector). */
export const SIZE_ICON: Record<ComponentSize, string> = {
  xs: '[&>svg]:w-3 [&>svg]:h-3',
  sm: '[&>svg]:w-4 [&>svg]:h-4',
  md: '[&>svg]:w-4.5 [&>svg]:h-4.5',
  lg: '[&>svg]:w-5 [&>svg]:h-5',
  xl: '[&>svg]:w-6 [&>svg]:h-6',
} as const satisfies Record<ComponentSize, string>;

/** Gap between inner elements per size. */
export const SIZE_GAP: Record<ComponentSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
} as const satisfies Record<ComponentSize, string>;

/** Clear button / chevron icon dimensions per size. */
export const CLEAR_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
  xl: 'w-5 h-5',
} as const satisfies Record<ComponentSize, string>;

/** Inline loading spinner dimensions per size. */
export const SPINNER_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-3.5 h-3.5 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-4.5 h-4.5 border-2',
  xl: 'w-5 h-5 border-2',
} as const satisfies Record<ComponentSize, string>;

/** Focus ring applied to non-flushed wrapper. */
export const FOCUS_RING = 'focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2';

/** Shared base classes for native input and textarea elements. */
export const FORM_INPUT_BASE = 'flex-1 min-w-0 bg-transparent outline-none border-none';

/** Shared placeholder color classes for input and textarea. */
export const FORM_PLACEHOLDER = 'placeholder:text-slate-400 dark:placeholder:text-zinc-500';

/** Shared class string for clear buttons inside form fields. */
export const FORM_CLEAR_CLASSES = `shrink-0 flex items-center cursor-pointer bg-transparent border-none p-0 ${kbClasses.textMuted} hover:text-slate-700 dark:hover:text-zinc-200 ${kbClasses.transition}`;

/** Invalid border for checkbox / radio control boxes when unchecked. */
export const FORM_INVALID_BORDER = 'border-red-500 dark:border-red-400';

/** Default unchecked border for checkbox / radio control boxes. */
export const FORM_UNCHECKED_BORDER = 'border-gray-300 dark:border-zinc-600';

/** Invalid-state text color for description slots in checkbox / radio / switch. */
export const FORM_INVALID_TEXT = 'text-red-500 dark:text-red-400';

/** Wrapper classes for label + description layout in checkbox / radio / switch. */
export const FORM_DESCRIPTION_WRAPPER = 'flex flex-col gap-0.5';

/** Renders an inline loading spinner for form fields. */
export function renderFormSpinner(sizeClass: string, extraClasses?: string): TemplateResult {
  const outer = extraClasses ? `shrink-0 flex items-center ${extraClasses}` : 'shrink-0 flex items-center';
  return html`<span class="${outer}"><span class="${sizeClass} rounded-full border-current border-t-transparent animate-spin" style="border-style:solid"></span></span>`;
}

/** Checked/active fill (bg + border) per color scheme. Shared by checkbox and switch. */
export const CHECKED_FILL_SCHEME: Record<KnownColorScheme, string> = {
  blue: 'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500',
  red: 'bg-red-500 border-red-500 dark:bg-red-600 dark:border-red-600',
  green: 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600',
  yellow: 'bg-yellow-500 border-yellow-500 dark:bg-yellow-500 dark:border-yellow-500',
  black: 'bg-gray-900 border-gray-900 dark:bg-zinc-100 dark:border-zinc-100',
} as const satisfies Record<KnownColorScheme, string>;

export const DEFAULT_CHECKED_FILL = 'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500';

/** Builds an unchecked-hover color scheme map for a given Tailwind group name. */
export function buildGroupHoverScheme(group: string): Readonly<Record<KnownColorScheme, string>> {
  return {
    blue: `group-hover/${group}:border-blue-400 dark:group-hover/${group}:border-blue-400`,
    red: `group-hover/${group}:border-red-400 dark:group-hover/${group}:border-red-400`,
    green: `group-hover/${group}:border-green-400 dark:group-hover/${group}:border-green-400`,
    yellow: `group-hover/${group}:border-yellow-400 dark:group-hover/${group}:border-yellow-400`,
    black: `group-hover/${group}:border-gray-600 dark:group-hover/${group}:border-zinc-300`,
  };
}

export function buildDefaultGroupHover(group: string): string {
  return `group-hover/${group}:border-gray-500 dark:group-hover/${group}:border-zinc-400`;
}
