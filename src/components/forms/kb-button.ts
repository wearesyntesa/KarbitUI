import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import {
  INTERACTIVE_GHOST,
  INTERACTIVE_LINK,
  INTERACTIVE_OUTLINE,
  INTERACTIVE_SOLID,
  lookupScheme,
} from '../../core/color-schemes.js';
import { ICON_SIZE } from '../../core/component-tokens.js';
import { LOADING_SIZE } from '../../core/icons.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, KnownColorScheme } from '../../core/types.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const buttonRecipe = recipe({
  base: `inline-flex items-center justify-center font-sans font-semibold uppercase tracking-wide ${kbClasses.transition} cursor-pointer select-none ${kbClasses.focus}`,
  variants: {
    variant: {
      solid: 'border',
      outline: 'border',
      ghost: 'border border-transparent',
      link: 'border border-transparent underline underline-offset-4',
    },
    size: {
      xs: 'text-xs px-2 py-1 gap-1',
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5',
      xl: 'text-lg px-8 py-4 gap-3',
    },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
});

export type ButtonVariant = InferVariant<typeof buttonRecipe, 'variant'>;
export type ButtonSize = InferVariant<typeof buttonRecipe, 'size'>;

const VARIANT_DEFAULT_COLOR: Record<ButtonVariant, string> = {
  solid:
    'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 active:border-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:active:bg-blue-700',
  outline:
    'bg-white text-slate-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 dark:bg-transparent dark:text-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:border-zinc-500 dark:active:bg-zinc-700',
  ghost:
    'bg-transparent text-slate-900 hover:bg-gray-100 active:bg-gray-200 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  link: 'bg-transparent text-blue-500 decoration-blue-500/40 hover:decoration-blue-500 hover:text-blue-600 dark:text-blue-400 dark:decoration-blue-400/40 dark:hover:decoration-blue-400 dark:hover:text-blue-300',
} as const satisfies Record<ButtonVariant, string>;

const COLOR_SCHEME_MAP: Record<ButtonVariant, Record<KnownColorScheme, string>> = {
  solid: INTERACTIVE_SOLID,
  outline: INTERACTIVE_OUTLINE,
  ghost: INTERACTIVE_GHOST,
  link: INTERACTIVE_LINK,
};

/**
 * Primary interactive button with structured minimal styling.
 *
 * Supports icon slots, loading states with optional text, press feedback,
 * color schemes for all variants, and full-width mode.
 *
 * @slot - Button label content.
 * @slot icon-left - Leading icon element (SVG recommended).
 * @slot icon-right - Trailing icon element (SVG recommended).
 *
 * @example
 * ```html
 * <kb-button variant="solid" size="md">EXECUTE</kb-button>
 * <kb-button variant="outline" color-scheme="red">
 *   <svg slot="icon-left" ...></svg>
 *   DELETE
 * </kb-button>
 * <kb-button loading loading-text="Saving...">SAVE</kb-button>
 * <kb-button full-width>FULL WIDTH</kb-button>
 * ```
 */
@customElement('kb-button')
export class KbButton extends KbBaseElement<'icon-left' | 'icon-right'> {
  /** Visual variant controlling border, background, and text styles. @defaultValue 'solid' */
  @property({ type: String }) variant: ButtonVariant = 'solid';
  /** Button size controlling padding, font size, and icon sizing. @defaultValue 'md' */
  @property({ type: String }) size: ButtonSize = 'md';
  /** Color scheme override. When unset, the variant's default color is used. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Show a spinner and disable interaction. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;
  /** Text displayed next to the spinner when loading. When omitted, the label is hidden during loading. */
  @property({ type: String, attribute: 'loading-text' }) loadingText?: string;
  /** HTML button type attribute. @defaultValue 'button' */
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';
  /** Stretch the button to fill its container width. @defaultValue false */
  @property({ type: Boolean, attribute: 'full-width' }) fullWidth: boolean = false;

  @state() private _pressed = false;

  private _onPointerDown(): void {
    if (this.disabled || this.loading) return;
    this._pressed = true;
  }

  private _onPointerUp(): void {
    this._pressed = false;
  }

  override render(): TemplateResult {
    const recipeClasses = buttonRecipe({ variant: this.variant, size: this.size });

    const disabledClasses = this.disabled || this.loading ? kbClasses.disabled : '';

    const colorMap = COLOR_SCHEME_MAP[this.variant];
    const colorClasses = lookupScheme(colorMap, this.colorScheme) ?? VARIANT_DEFAULT_COLOR[this.variant];

    const widthClass = this.fullWidth ? 'w-full' : '';
    const iconSizeClass = ICON_SIZE[this.size] ?? ICON_SIZE.md;

    const pressClass = this._pressed && !this.disabled && !this.loading ? 'scale-[0.97]' : '';

    const classes = this.buildClasses(
      recipeClasses,
      colorClasses,
      disabledClasses,
      widthClass,
      iconSizeClass,
      pressClass,
    );

    const iconLeft = this.slotted('icon-left');
    const iconRight = this.slotted('icon-right');

    const spinnerClasses = `inline-block rounded-full border-current border-t-transparent animate-spin ${LOADING_SIZE[this.size] ?? LOADING_SIZE.md}`;

    let leftContent = nothing as typeof nothing | ReturnType<typeof html>;
    if (this.loading) {
      leftContent = html`<span class=${spinnerClasses}></span>`;
    } else if (iconLeft) {
      leftContent = html`<span class="flex-shrink-0 leading-[0]" aria-hidden="true">${iconLeft}</span>`;
    }

    let mainContent: typeof nothing | ReturnType<typeof html> | Node[] = nothing;
    if (this.loading && this.loadingText !== undefined) {
      mainContent = html`<span>${this.loadingText}</span>`;
    } else if (!this.loading) {
      mainContent = this.defaultSlotContent;
    }

    return html`
      <button
        class=${classes}
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointerleave=${this._onPointerUp}
      >
        ${leftContent}
        ${mainContent}
        ${
          !this.loading && iconRight
            ? html`<span class="flex-shrink-0 leading-[0]" aria-hidden="true">${iconRight}</span>`
            : nothing
        }
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-button': KbButton;
  }
}
