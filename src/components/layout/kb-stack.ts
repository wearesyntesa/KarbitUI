import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { Orientation, SpacingValue } from '../../core/types.js';

type StackDirection = Orientation | 'horizontal' | 'vertical';

/**
 * Linear stack layout. Arranges children vertically or horizontally with consistent spacing.
 *
 * @slot - Default slot for child content.
 *
 * @example
 * ```html
 * <kb-stack direction="vertical" spacing="4">
 *   <kb-box>Item 1</kb-box>
 *   <kb-box>Item 2</kb-box>
 * </kb-stack>
 * ```
 */
@customElement('kb-stack')
export class KbStack extends KbBaseElement {
  static override hostDisplay = 'block';
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) direction: StackDirection = 'vertical';
  @property({ type: String }) spacing?: SpacingValue;

  override render() {
    const isHorizontal = this.direction === 'horizontal';
    const dirClass = isHorizontal ? 'flex-row' : 'flex-col';
    const spacingClass = this.spacing ? `gap-${this.spacing}` : '';

    const classes = this.buildClasses('flex', dirClass, spacingClass);
    return html`<div class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-stack': KbStack;
  }
}
