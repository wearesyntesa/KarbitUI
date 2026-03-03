import type { PropertyValues } from 'lit';
import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { FontSizeValue } from '../../core/types.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const textRecipe = recipe({
  base: '',
  variants: {
    variant: {
      body: 'font-sans',
      label: 'text-xs uppercase tracking-widest',
      caption: 'font-sans text-xs',
      overline: 'text-[10px] font-semibold uppercase tracking-widest',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
      '2xl': 'text-xl',
    },
  },
  defaultVariants: { variant: 'body', size: 'base' },
});

export type TextVariant = InferVariant<typeof textRecipe, 'variant'>;
export type TextTone = 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error';
export type TextAs = 'p' | 'span' | 'div' | 'label';

const TONE_MAP: Record<TextTone, string> = {
  primary: kbClasses.textPrimary,
  secondary: kbClasses.textSecondary,
  muted: kbClasses.textMuted,
  accent: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
} as const satisfies Record<TextTone, string>;

const VARIANT_DEFAULT_TONE: Record<TextVariant, string> = {
  body: kbClasses.textPrimary,
  label: kbClasses.textSecondary,
  caption: kbClasses.textSecondary,
  overline: kbClasses.textSecondary,
} as const satisfies Record<TextVariant, string>;

const CLAMP_MAP: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

/**
 * Body text element with structured minimal typography.
 *
 * @slot - Text content.
 *
 * @example
 * ```html
 * <kb-text size="lg" font-weight="bold">Bold statement.</kb-text>
 * <kb-text variant="label">Field label</kb-text>
 * <kb-text variant="caption" tone="muted">Updated 3 min ago</kb-text>
 * <kb-text variant="overline">Section</kb-text>
 * <kb-text clamp="2">Long text that clamps to two lines...</kb-text>
 * ```
 */
export class KbText extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Typography preset controlling font family, case, and tracking. @defaultValue 'body' */
  @property({ type: String }) variant: TextVariant = 'body';
  /** Font size override. When variant is `'body'`, defaults to `'base'`; other variants use their recipe size. */
  @property({ type: String }) size?: FontSizeValue;
  /** Semantic color tone. Falls back to the variant's default tone when unset. */
  @property({ type: String }) tone?: TextTone;
  /** Maximum visible lines before truncation with an ellipsis (1–6). */
  @property({ type: Number }) clamp?: number;
  /** Prevent text wrapping with `whitespace-nowrap`. @defaultValue false */
  @property({ type: Boolean, attribute: 'no-wrap' }) noWrap: boolean = false;
  /** Truncate overflowing text with an ellipsis on a single line. @defaultValue false */
  @property({ type: Boolean }) truncate: boolean = false;
  /** HTML element to render. @defaultValue 'p' */
  @property({ type: String }) as: TextAs = 'p';

  private _cachedRecipeClasses = '';

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has('variant') || changed.has('size')) {
      const sizeOverride = this.variant === 'body' ? (this.size ?? 'base') : this.size;
      this._cachedRecipeClasses = textRecipe({
        variant: this.variant,
        ...(sizeOverride ? { size: sizeOverride as 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' } : {}),
      });
    }
  }

  override render(): TemplateResult {
    const toneClasses = this.tone
      ? (TONE_MAP[this.tone] ?? VARIANT_DEFAULT_TONE[this.variant])
      : VARIANT_DEFAULT_TONE[this.variant];

    const truncateClass = this.truncate ? 'truncate' : '';
    const noWrapClass = this.noWrap ? 'whitespace-nowrap' : '';
    const clampClass = this.clamp ? (CLAMP_MAP[this.clamp] ?? '') : '';

    const classes = this.buildClasses(this._cachedRecipeClasses, toneClasses, truncateClass, noWrapClass, clampClass);

    switch (this.as) {
      case 'span':
        return html`<span class=${classes}>${this.defaultSlotContent}</span>`;
      case 'div':
        return html`<div class=${classes}>${this.defaultSlotContent}</div>`;
      case 'label':
        return html`<label class=${classes}>${this.defaultSlotContent}</label>`;
      default:
        return html`<p class=${classes}>${this.defaultSlotContent}</p>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-text': KbText;
  }
}
