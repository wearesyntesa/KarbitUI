import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';

type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

const headingRecipe = recipe({
  base: `font-sans font-bold ${kbClasses.textPrimary}`,
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
  },
  defaultVariants: { size: 'xl' },
});

const SIZE_FOR_LEVEL: Record<HeadingLevel, HeadingSize> = {
  '1': '4xl',
  '2': '3xl',
  '3': '2xl',
  '4': 'xl',
  '5': 'lg',
  '6': 'md',
};

/**
 * Heading element (h1-h6) with structured minimal typography.
 *
 * @slot - Heading content.
 *
 * @example
 * ```html
 * <kb-heading level="2" size="3xl">Section Title</kb-heading>
 * ```
 */
@customElement('kb-heading')
export class KbHeading extends KbBaseElement {
  static override hostDisplay = 'block';
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) level: HeadingLevel = '2';
  @property({ type: String }) size?: HeadingSize;

  override render() {
    const resolvedSize = this.size ?? SIZE_FOR_LEVEL[this.level];
    const recipeClasses = headingRecipe({ size: resolvedSize });
    const classes = this.buildClasses(recipeClasses);

    switch (this.level) {
      case '1': return html`<h1 class=${classes}>${this.defaultSlotContent}</h1>`;
      case '2': return html`<h2 class=${classes}>${this.defaultSlotContent}</h2>`;
      case '3': return html`<h3 class=${classes}>${this.defaultSlotContent}</h3>`;
      case '4': return html`<h4 class=${classes}>${this.defaultSlotContent}</h4>`;
      case '5': return html`<h5 class=${classes}>${this.defaultSlotContent}</h5>`;
      case '6': return html`<h6 class=${classes}>${this.defaultSlotContent}</h6>`;
      default: return html`<h2 class=${classes}>${this.defaultSlotContent}</h2>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-heading': KbHeading;
  }
}
