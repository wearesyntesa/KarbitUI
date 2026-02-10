import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme } from '../../core/types.js';

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

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const VARIANT_DEFAULT_COLOR: Record<ButtonVariant, string> = {
  solid: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 active:border-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:active:bg-blue-700',
  outline: 'bg-white text-slate-900 border-gray-200 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 dark:bg-transparent dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:border-zinc-500 dark:active:bg-zinc-700',
  ghost: 'bg-transparent text-slate-900 hover:bg-gray-100 active:bg-gray-200 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  link: 'bg-transparent text-blue-500 decoration-blue-500/40 hover:decoration-blue-500 hover:text-blue-600 dark:text-blue-400 dark:decoration-blue-400/40 dark:hover:decoration-blue-400 dark:hover:text-blue-300',
};

const COLOR_SCHEME_SOLID: Record<string, string> = {
  black: 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800 hover:border-gray-800 active:bg-black active:border-black dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:hover:border-zinc-300 dark:active:bg-zinc-400 dark:active:border-zinc-400',
  red: 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 active:bg-red-700 active:border-red-700 dark:bg-red-600 dark:border-red-600 dark:hover:bg-red-500 dark:hover:border-red-500 dark:active:bg-red-700 dark:active:border-red-700',
  blue: 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 active:border-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:active:bg-blue-700 dark:active:border-blue-700',
  green: 'bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600 active:bg-green-700 active:border-green-700 dark:bg-green-600 dark:border-green-600 dark:hover:bg-green-500 dark:hover:border-green-500 dark:active:bg-green-700 dark:active:border-green-700',
  yellow: 'bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-600 hover:border-yellow-600 active:bg-yellow-700 active:border-yellow-700 dark:bg-yellow-500 dark:border-yellow-500 dark:text-black dark:hover:bg-yellow-400 dark:hover:border-yellow-400 dark:active:bg-yellow-600 dark:active:border-yellow-600',
};

const COLOR_SCHEME_OUTLINE: Record<string, string> = {
  black: 'bg-white text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white active:bg-black dark:bg-transparent dark:text-zinc-100 dark:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 dark:active:bg-zinc-300',
  red: 'bg-white text-red-600 border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 dark:bg-transparent dark:text-red-400 dark:border-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:active:bg-red-600',
  blue: 'bg-white text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 dark:bg-transparent dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:active:bg-blue-600',
  green: 'bg-white text-green-600 border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600 dark:bg-transparent dark:text-green-400 dark:border-green-500 dark:hover:bg-green-500 dark:hover:text-white dark:active:bg-green-600',
  yellow: 'bg-white text-yellow-600 border-yellow-500 hover:bg-yellow-500 hover:text-black active:bg-yellow-600 dark:bg-transparent dark:text-yellow-400 dark:border-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-black dark:active:bg-yellow-600',
};

const COLOR_SCHEME_GHOST: Record<string, string> = {
  black: 'bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  red: 'bg-transparent text-red-600 hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-950 dark:active:bg-red-900',
  blue: 'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-950 dark:active:bg-blue-900',
  green: 'bg-transparent text-green-600 hover:bg-green-50 active:bg-green-100 dark:text-green-400 dark:hover:bg-green-950 dark:active:bg-green-900',
  yellow: 'bg-transparent text-yellow-600 hover:bg-yellow-50 active:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-950 dark:active:bg-yellow-900',
};

const COLOR_SCHEME_LINK: Record<string, string> = {
  black: 'bg-transparent text-gray-900 decoration-gray-900/40 hover:decoration-gray-900 dark:text-zinc-100 dark:decoration-zinc-100/40 dark:hover:decoration-zinc-100',
  red: 'bg-transparent text-red-500 decoration-red-500/40 hover:decoration-red-500 hover:text-red-600 dark:text-red-400 dark:decoration-red-400/40 dark:hover:decoration-red-400 dark:hover:text-red-300',
  blue: 'bg-transparent text-blue-500 decoration-blue-500/40 hover:decoration-blue-500 hover:text-blue-600 dark:text-blue-400 dark:decoration-blue-400/40 dark:hover:decoration-blue-400 dark:hover:text-blue-300',
  green: 'bg-transparent text-green-500 decoration-green-500/40 hover:decoration-green-500 hover:text-green-600 dark:text-green-400 dark:decoration-green-400/40 dark:hover:decoration-green-400 dark:hover:text-green-300',
  yellow: 'bg-transparent text-yellow-500 decoration-yellow-500/40 hover:decoration-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:decoration-yellow-400/40 dark:hover:decoration-yellow-400 dark:hover:text-yellow-300',
};

const COLOR_SCHEME_MAP: Record<ButtonVariant, Record<string, string>> = {
  solid: COLOR_SCHEME_SOLID,
  outline: COLOR_SCHEME_OUTLINE,
  ghost: COLOR_SCHEME_GHOST,
  link: COLOR_SCHEME_LINK,
};

const LOADING_SIZE: Record<ButtonSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-3.5 h-3.5 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-5 h-5 border-2',
  xl: 'w-6 h-6 border-2',
};

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: '[&>svg]:w-3 [&>svg]:h-3',
  sm: '[&>svg]:w-3.5 [&>svg]:h-3.5',
  md: '[&>svg]:w-4 [&>svg]:h-4',
  lg: '[&>svg]:w-5 [&>svg]:h-5',
  xl: '[&>svg]:w-6 [&>svg]:h-6',
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
export class KbButton extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) variant: ButtonVariant = 'solid';
  @property({ type: String }) size: ButtonSize = 'md';
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) loading: boolean = false;
  @property({ type: String, attribute: 'loading-text' }) loadingText?: string;
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';
  @property({ type: Boolean, attribute: 'full-width' }) fullWidth: boolean = false;

  @state() private _pressed = false;

  private _onPointerDown(): void {
    if (this.disabled || this.loading) return;
    this._pressed = true;
  }

  private _onPointerUp(): void {
    this._pressed = false;
  }

  override render() {
    const recipeClasses = buttonRecipe({ variant: this.variant, size: this.size });

    const disabledClasses = (this.disabled || this.loading)
      ? kbClasses.disabled
      : '';

    const colorMap = COLOR_SCHEME_MAP[this.variant];
    const colorClasses = this.colorScheme && colorMap
      ? colorMap[this.colorScheme] ?? VARIANT_DEFAULT_COLOR[this.variant]
      : VARIANT_DEFAULT_COLOR[this.variant];

    const widthClass = this.fullWidth ? 'w-full' : '';
    const iconSizeClass = ICON_SIZE[this.size] ?? ICON_SIZE.md;

    const pressClass = this._pressed && !this.disabled && !this.loading
      ? 'scale-[0.97]'
      : '';

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

    return html`
      <button
        class=${classes}
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @pointerdown=${() => this._onPointerDown()}
        @pointerup=${() => this._onPointerUp()}
        @pointerleave=${() => this._onPointerUp()}
      >
        ${this.loading
          ? html`<span class=${spinnerClasses}></span>`
          : iconLeft
            ? html`<span class="flex-shrink-0 leading-[0]" aria-hidden="true">${iconLeft}</span>`
            : nothing
        }
        ${this.loading && this.loadingText !== undefined
          ? html`<span>${this.loadingText}</span>`
          : this.loading
            ? nothing
            : this.defaultSlotContent
        }
        ${!this.loading && iconRight
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
