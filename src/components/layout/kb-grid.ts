import { html } from 'lit';
import type { PropertyValues } from 'lit';
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

  /** Number of grid columns (e.g. `'3'`, `'none'`). Maps to the `gridCols` style prop. */
  @property({ type: String }) columns?: string;
  /** Number of grid rows. Maps to the `gridRows` style prop. */
  @property({ type: String }) rows?: string;

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this.columns && !this.gridCols) this.gridCols = this.columns;
    if (this.rows && !this.gridRows) this.gridRows = this.rows;
  }

  override render() {
    const classes = this.buildClasses('grid');
    return html`<div class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-grid': KbGrid;
  }
}
