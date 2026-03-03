import { lookupScheme, STATIC_OUTLINE, STATIC_SOLID, STATIC_SUBTLE } from './color-schemes.js';
import { kbClasses } from './theme.js';
import type { ColorScheme, KnownColorScheme } from './types.js';

export type LabelVariant = 'solid' | 'outline' | 'subtle';

export const LABEL_RECIPE_BASE =
  'inline-flex items-center font-semibold uppercase tracking-widest whitespace-nowrap select-none';

export const LABEL_VARIANT_STRUCTURE: Record<LabelVariant, string> = {
  solid: 'border',
  outline: 'bg-transparent border',
  subtle: 'border border-transparent',
} as const satisfies Record<LabelVariant, string>;

export const LABEL_INTERACTIVE_HOVER: Record<LabelVariant, string> = {
  solid: 'hover:opacity-80 active:opacity-70',
  outline: 'hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  subtle: 'hover:bg-gray-200/80 active:bg-gray-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
} as const satisfies Record<LabelVariant, string>;

export const DISMISS_VISIBLE = 'opacity-100 scale-100';

export const DISMISS_HIDDEN = 'opacity-0 scale-95';

export const CLOSE_BUTTON_CLASSES = `shrink-0 cursor-pointer opacity-50 hover:opacity-100 ${kbClasses.transitionColors} leading-none p-0 bg-transparent border-none text-current select-none`;

/**
 * Resolves the color classes for a static (non-interactive) label variant.
 *
 * Looks up the color scheme in the static solid/outline/subtle maps,
 * falling back to the component's variant default color.
 */
export function resolveStaticColor(
  variant: LabelVariant,
  colorScheme: ColorScheme | undefined,
  defaultColors: Readonly<Record<LabelVariant, string>>,
): string {
  if (!colorScheme) return defaultColors[variant];
  let schemeMap: Record<KnownColorScheme, string>;
  if (variant === 'solid') schemeMap = STATIC_SOLID;
  else if (variant === 'outline') schemeMap = STATIC_OUTLINE;
  else schemeMap = STATIC_SUBTLE;
  return lookupScheme(schemeMap, colorScheme) ?? defaultColors[variant];
}
