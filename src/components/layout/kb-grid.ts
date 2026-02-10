import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';

/**
 * CSS Grid layout container.
 *
 * @slot - Default slot for child content.
 *
 * @example
 * ```html
 * <kb-grid columns="3" gap="4">
 *   <kb-box>1</kb-box>
 *   <kb-box>2</kb-box>
 *   <kb-box>3</kb-box>
 * </kb-grid>
 * ```
 */
@customElement('kb-grid')
export class KbGrid extends KbBaseElement {
  static override hostDisplay = 'block';
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) columns?: string;
  @property({ type: String }) rows?: string;

  override render() {
    if (this.columns && !this.gridCols) this.gridCols = this.columns;
    if (this.rows && !this.gridRows) this.gridRows = this.rows;

    const classes = this.buildClasses('grid');
    return html`<div class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-grid': KbGrid;
  }
}
