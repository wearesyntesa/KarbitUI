import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';

export type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';
export type HeadingTone = 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const headingRecipe = recipe({
  base: 'font-sans',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    weight: {
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
  },
  defaultVariants: { size: 'xl', weight: 'bold' },
});

export type HeadingSize = InferVariant<typeof headingRecipe, 'size'>;
export type HeadingWeight = InferVariant<typeof headingRecipe, 'weight'>;

const SIZE_FOR_LEVEL: Record<HeadingLevel, HeadingSize> = {
  '1': '4xl',
  '2': '3xl',
  '3': '2xl',
  '4': 'xl',
  '5': 'lg',
  '6': 'md',
} as const satisfies Record<HeadingLevel, HeadingSize>;

const TONE_MAP: Record<HeadingTone, string> = {
  primary: kbClasses.textPrimary,
  secondary: kbClasses.textSecondary,
  muted: kbClasses.textMuted,
  accent: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
} as const satisfies Record<HeadingTone, string>;

/**
 * Heading element (h1-h6) with structured minimal typography.
 *
 * @slot - Heading content.
 *
 * @example
 * ```html
 * <kb-heading level="2" size="3xl">Section Title</kb-heading>
 * <kb-heading level="1" weight="black" tone="accent">Feature</kb-heading>
 * <kb-heading level="3" truncate>Very long heading text...</kb-heading>
 * ```
 */
export class KbHeading extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Semantic heading level (`'1'`–`'6'`). Determines the rendered `<h1>`–`<h6>` element and default size. @defaultValue '2' */
  @property({ type: String }) level: HeadingLevel = '2';
  /** Explicit size override. When unset, derived from `level` (e.g. level `'1'` → `'4xl'`). */
  @property({ type: String }) size?: HeadingSize;
  /** Font weight. @defaultValue 'bold' */
  @property({ type: String }) weight: HeadingWeight = 'bold';
  /** Semantic color tone. When unset, uses the recipe's default primary tone. */
  @property({ type: String }) tone?: HeadingTone;
  /** Truncate overflowing text with an ellipsis on a single line. @defaultValue false */
  @property({ type: Boolean }) truncate: boolean = false;

  private _cachedRecipeClasses = '';

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this._cachedRecipeClasses === '' || changed.has('level') || changed.has('size') || changed.has('weight')) {
      const resolvedSize = this.size ?? SIZE_FOR_LEVEL[this.level];
      this._cachedRecipeClasses = headingRecipe({ size: resolvedSize, weight: this.weight });
    }
  }

  override render(): TemplateResult {
    const toneClasses = this.tone ? (TONE_MAP[this.tone] ?? kbClasses.textPrimary) : kbClasses.textPrimary;

    const truncateClass = this.truncate ? 'truncate' : '';

    const classes = this.buildClasses(this._cachedRecipeClasses, toneClasses, truncateClass);

    switch (this.level) {
      case '1':
        return html`<h1 class=${classes}>${this.defaultSlotContent}</h1>`;
      case '2':
        return html`<h2 class=${classes}>${this.defaultSlotContent}</h2>`;
      case '3':
        return html`<h3 class=${classes}>${this.defaultSlotContent}</h3>`;
      case '4':
        return html`<h4 class=${classes}>${this.defaultSlotContent}</h4>`;
      case '5':
        return html`<h5 class=${classes}>${this.defaultSlotContent}</h5>`;
      case '6':
        return html`<h6 class=${classes}>${this.defaultSlotContent}</h6>`;
      default:
        return html`<h2 class=${classes}>${this.defaultSlotContent}</h2>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-heading': KbHeading;
  }
}
