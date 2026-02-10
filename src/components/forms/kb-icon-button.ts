import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { INTERACTIVE_SOLID, INTERACTIVE_OUTLINE, INTERACTIVE_GHOST } from '../../core/color-schemes.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize, ColorScheme } from '../../core/types.js';

export type IconButtonVariant = 'solid' | 'outline' | 'ghost';

const iconButtonRecipe = recipe({
  base: `inline-flex items-center justify-center ${kbClasses.transition} cursor-pointer select-none aspect-square ${kbClasses.focus}`,
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

const VARIANT_DEFAULT_COLOR: Record<IconButtonVariant, string> = {
  solid: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:active:bg-blue-700',
  outline: 'bg-white text-slate-900 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 dark:bg-transparent dark:text-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:border-zinc-500 dark:active:bg-zinc-700',
  ghost: 'bg-transparent text-slate-900 hover:bg-gray-100 active:bg-gray-200 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
};

const COLOR_SCHEME_MAP: Record<IconButtonVariant, Record<ColorScheme, string>> = {
  solid: INTERACTIVE_SOLID,
  outline: INTERACTIVE_OUTLINE,
  ghost: INTERACTIVE_GHOST,
};

const LOADING_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-3.5 h-3.5 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-5 h-5 border-2',
  xl: 'w-6 h-6 border-2',
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
@customElement('kb-icon-button')
export class KbIconButton extends KbBaseElement {
  /** Visual variant controlling border, background, and text styles. @defaultValue 'solid' */
  @property({ type: String }) variant: IconButtonVariant = 'solid';
  /** Button size controlling dimensions and icon scaling. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Color scheme override. When unset, the variant's default color is used. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Accessible label for the icon-only button (required for screen readers). */
  @property({ type: String }) label!: string;
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Show a spinner and disable interaction. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;

  @state() private _pressed = false;

  private _onPointerDown(): void {
    if (this.disabled || this.loading) return;
    this._pressed = true;
  }

  private _onPointerUp(): void {
    this._pressed = false;
  }

  override render() {
    const recipeClasses = iconButtonRecipe({ variant: this.variant, size: this.size });
    const disabledClasses = (this.disabled || this.loading) ? kbClasses.disabled : '';

    const colorMap = COLOR_SCHEME_MAP[this.variant];
    const colorClasses = this.colorScheme && colorMap
      ? colorMap[this.colorScheme] ?? VARIANT_DEFAULT_COLOR[this.variant]
      : VARIANT_DEFAULT_COLOR[this.variant];

    const pressClass = this._pressed && !this.disabled && !this.loading
      ? 'scale-[0.95]'
      : '';

    const classes = this.buildClasses(recipeClasses, colorClasses, disabledClasses, pressClass);

    return html`
      <button
        class=${classes}
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.label}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-busy=${this.loading ? 'true' : 'false'}
        @pointerdown=${() => this._onPointerDown()}
        @pointerup=${() => this._onPointerUp()}
        @pointerleave=${() => this._onPointerUp()}
      >
        ${this.loading
          ? html`<span class="inline-block rounded-full border-current border-t-transparent animate-spin ${LOADING_SIZE[this.size]}"></span>`
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
