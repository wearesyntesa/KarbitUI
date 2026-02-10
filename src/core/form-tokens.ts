import type { ComponentSize } from './types.js';

/** Shared variant type for form field wrappers (kb-input, kb-textarea, kb-select). */
export type FormVariant = 'outline' | 'filled' | 'flushed';

/** Wrapper border/bg classes per variant. */
export const VARIANT_WRAPPER: Record<FormVariant, string> = {
  outline: 'bg-white border border-gray-200 dark:border-zinc-700 dark:bg-transparent hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:hover:border-blue-500 dark:focus-within:hover:border-blue-400',
  filled: 'bg-gray-100 border border-gray-100 hover:bg-gray-200/60 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-700 focus-within:bg-white focus-within:border-gray-300 dark:focus-within:bg-transparent dark:focus-within:border-zinc-600',
  flushed: 'bg-transparent border-b border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400',
};

/** Red border overrides for invalid state per variant. */
export const VARIANT_WRAPPER_INVALID: Record<FormVariant, string> = {
  outline: 'border-red-500 dark:border-red-500 hover:border-red-500 dark:hover:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
  filled: 'border-red-500 dark:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
  flushed: 'border-red-500 dark:border-red-500 hover:border-red-500 dark:hover:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
};

/** Horizontal + vertical padding per size. */
export const SIZE_PADDING: Record<ComponentSize, string> = {
  xs: 'px-2 py-1',
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
  xl: 'px-6 py-4',
};

/** Font size per component size. */
export const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

/** Slotted SVG icon dimensions per size (child selector). */
export const SIZE_ICON: Record<ComponentSize, string> = {
  xs: '[&>svg]:w-3 [&>svg]:h-3',
  sm: '[&>svg]:w-4 [&>svg]:h-4',
  md: '[&>svg]:w-4.5 [&>svg]:h-4.5',
  lg: '[&>svg]:w-5 [&>svg]:h-5',
  xl: '[&>svg]:w-6 [&>svg]:h-6',
};

/** Gap between inner elements per size. */
export const SIZE_GAP: Record<ComponentSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
};

/** Clear button / chevron icon dimensions per size. */
export const CLEAR_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
  xl: 'w-5 h-5',
};

/** Inline loading spinner dimensions per size. */
export const SPINNER_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-3.5 h-3.5 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-4.5 h-4.5 border-2',
  xl: 'w-5 h-5 border-2',
};

/** Focus ring applied to non-flushed wrapper. */
export const FOCUS_RING = 'focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2';
