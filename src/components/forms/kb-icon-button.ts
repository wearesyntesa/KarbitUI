import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement, springPressDown, springPressUp } from '../../core/base-element.js';
import { INTERACTIVE_GHOST, INTERACTIVE_OUTLINE, INTERACTIVE_SOLID, lookupScheme } from '../../core/color-schemes.js';
import { LOADING_SIZE } from '../../core/icons.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, KnownColorScheme } from '../../core/types.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const iconButtonRecipe = recipe({
  base: `inline-flex items-center justify-center leading-none ${kbClasses.transitionColors} cursor-pointer select-none aspect-square ${kbClasses.focus}`,
  variants: {
    variant: {
      solid: 'border',
      outline: 'border',
      ghost: 'border border-transparent',
    },
    size: {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-14 h-14 text-xl',
    },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
});

export type IconButtonVariant = InferVariant<typeof iconButtonRecipe, 'variant'>;

const VARIANT_DEFAULT_COLOR: Record<IconButtonVariant, string> = {
  solid:
    'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:active:bg-blue-700',
  outline:
    'bg-white text-slate-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 dark:bg-transparent dark:text-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:border-zinc-500 dark:active:bg-zinc-700',
  ghost:
    'bg-transparent text-slate-900 hover:bg-gray-100 active:bg-gray-200 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
} as const satisfies Record<IconButtonVariant, string>;

const COLOR_SCHEME_MAP: Record<IconButtonVariant, Record<KnownColorScheme, string>> = {
  solid: INTERACTIVE_SOLID,
  outline: INTERACTIVE_OUTLINE,
  ghost: INTERACTIVE_GHOST,
};

/**
 * Icon-only button for toolbar actions and compact controls.
 *
 * Supports color schemes, press feedback, and all three variants.
 *
 * @slot - Icon content (SVG or text symbol).
 *
 * @example
 * ```html
 * <kb-icon-button variant="outline" label="Close" color-scheme="red">&times;</kb-icon-button>
 * ```
 */
export class KbIconButton extends KbBaseElement {
  static override hostDisplay = 'inline-flex' as const;
  /** Visual variant controlling border, background, and text styles. @defaultValue 'solid' */
  @property({ type: String }) variant: IconButtonVariant = 'solid';
  /** Button size controlling dimensions and icon scaling. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Color scheme override. When unset, the variant's default color is used. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Accessible label for the icon-only button (required for screen readers). @defaultValue '' */
  @property({ type: String }) label: string = '';
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Show a spinner and disable interaction. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;

  private _cachedRecipeClasses = '';

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this._cachedRecipeClasses === '' || changed.has('variant') || changed.has('size')) {
      this._cachedRecipeClasses = iconButtonRecipe({ variant: this.variant, size: this.size });
    }
    if (changed.has('loading')) {
      // Spinner replaces icon when loading. In Light DOM the captured icon node
      // remains a direct host child — hide it explicitly so it doesn't leak through.
      this.setDefaultSlotVisible(!this.loading);
    }
  }

  private _onPointerDown(e: PointerEvent): void {
    if (this.disabled || this.loading) return;
    const btn = e.currentTarget as HTMLElement;
    springPressDown(btn, 0.95);
  }

  private _onPointerUp(e: PointerEvent): void {
    const btn = e.currentTarget as HTMLElement;
    springPressUp(btn);
  }

  override render(): TemplateResult {
    const disabledClasses = this.disabled || this.loading ? kbClasses.disabled : '';

    const colorMap = COLOR_SCHEME_MAP[this.variant];
    const colorClasses = lookupScheme(colorMap, this.colorScheme) ?? VARIANT_DEFAULT_COLOR[this.variant];

    const classes = this.buildClasses(this._cachedRecipeClasses, colorClasses, disabledClasses);

    return html`
      <button
        class=${classes}
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.label}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-busy=${this.loading ? 'true' : 'false'}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointerleave=${this._onPointerUp}
      >
        ${
          this.loading
            ? html`<span class="inline-block border-current border-t-transparent animate-spin ${LOADING_SIZE[this.size]}" style="border-radius:9999px"></span>`
            : this.defaultSlotContent
        }
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-icon-button': KbIconButton;
  }
}
