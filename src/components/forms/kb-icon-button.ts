import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

type IconButtonVariant = 'solid' | 'outline' | 'ghost';

const iconButtonRecipe = recipe({
  base: `inline-flex items-center justify-center ${kbClasses.transition} cursor-pointer select-none aspect-square ${kbClasses.focus}`,
  variants: {
    variant: {
      solid: 'bg-blue-500 text-white border border-blue-500 hover:bg-blue-600 hover:border-blue-600 active:bg-blue-700 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:active:bg-blue-700',
      outline: `bg-white text-slate-900 ${kbClasses.border} hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 dark:bg-transparent dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:active:bg-zinc-700`,
      ghost: 'bg-transparent text-slate-900 border border-transparent hover:bg-gray-100 active:bg-gray-200 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
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

/**
 * Icon-only button for toolbar actions and compact controls.
 *
 * @slot - Icon content (SVG or text symbol).
 *
 * @example
 * ```html
 * <kb-icon-button variant="outline" label="Close">&times;</kb-icon-button>
 * ```
 */
@customElement('kb-icon-button')
export class KbIconButton extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) variant: IconButtonVariant = 'solid';
  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: String }) label!: string;
  @property({ type: Boolean }) disabled: boolean = false;

  override render() {
    const recipeClasses = iconButtonRecipe({ variant: this.variant, size: this.size });
    const disabledClasses = this.disabled ? kbClasses.disabled : '';
    const classes = this.buildClasses(recipeClasses, disabledClasses);

    return html`
      <button
        class=${classes}
        ?disabled=${this.disabled}
        aria-label=${this.label}
        aria-disabled=${this.disabled ? 'true' : 'false'}
      >
        ${this.defaultSlotContent}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-icon-button': KbIconButton;
  }
}
