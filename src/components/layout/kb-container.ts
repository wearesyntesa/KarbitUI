import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { DimensionValue } from '../../core/types.js';

/**
 * Centered content container with a configurable max-width.
 *
 * @slot - Default slot for child content.
 *
 * @example
 * ```html
 * <kb-container max="4xl" center>
 *   <p>Centered content with max width.</p>
 * </kb-container>
 * ```
 */
@customElement('kb-container')
export class KbContainer extends KbBaseElement {
  static override hostDisplay = 'block';
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) max?: DimensionValue;
  @property({ type: Boolean, reflect: true }) center: boolean = true;

  override render() {
    const maxClass = this.max ? `max-w-${this.max}` : 'max-w-7xl';
    const centerClass = this.center ? 'mx-auto' : '';
    const classes = this.buildClasses('w-full', 'px-4', maxClass, centerClass);
    return html`<div class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-container': KbContainer;
  }
}
