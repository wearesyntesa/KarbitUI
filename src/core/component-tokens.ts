import type { ComponentSize } from './types.js';

/** Slotted SVG icon dimensions per size. Shared by button, tabs, and similar components that render icon slots at standard sizes. */
export const ICON_SIZE: Record<ComponentSize, string> = {
  xs: '[&>svg]:w-3 [&>svg]:h-3',
  sm: '[&>svg]:w-3.5 [&>svg]:h-3.5',
  md: '[&>svg]:w-4 [&>svg]:h-4',
  lg: '[&>svg]:w-5 [&>svg]:h-5',
  xl: '[&>svg]:w-6 [&>svg]:h-6',
} as const satisfies Record<ComponentSize, string>;
