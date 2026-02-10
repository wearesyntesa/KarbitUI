import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { FontSizeValue } from '../../core/types.js';

const textRecipe = recipe({
  base: `font-sans ${kbClasses.textPrimary}`,
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
      '2xl': 'text-xl',
    },
  },
  defaultVariants: { size: 'base' },
});

/**
 * Body text element with structured minimal typography.
 *
 * @slot - Text content.
 *
 * @example
 * ```html
 * <kb-text size="lg" font-weight="bold">Bold statement.</kb-text>
 * ```
 */
@customElement('kb-text')
export class KbText extends KbBaseElement {
  static override hostDisplay = 'block';
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) size?: FontSizeValue;
  @property({ type: Boolean }) truncate: boolean = false;

  override render() {
    const recipeClasses = textRecipe({ size: (this.size ?? 'base') as 'base' });
    const truncateClass = this.truncate ? 'truncate' : '';
    const classes = this.buildClasses(recipeClasses, truncateClass);
    return html`<p class=${classes}>${this.defaultSlotContent}</p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-text': KbText;
  }
}
