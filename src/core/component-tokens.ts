import type { ComponentSize } from './types.js';

export const ICON_SIZE: Record<ComponentSize, string> = {
  xs: '[&_svg]:w-3 [&_svg]:h-3',
  sm: '[&_svg]:w-3.5 [&_svg]:h-3.5',
  md: '[&_svg]:w-4 [&_svg]:h-4',
  lg: '[&_svg]:w-5 [&_svg]:h-5',
  xl: '[&_svg]:w-6 [&_svg]:h-6',
} as const satisfies Record<ComponentSize, string>;
