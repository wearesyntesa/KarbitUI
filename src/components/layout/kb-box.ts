import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';

/**
 * Fundamental layout primitive. Renders a `<div>` with style prop support.
 *
 * @slot - Default slot for child content.
 *
 * @example
 * ```html
 * <kb-box bg="white" color="slate-900" p="4">
 *   Content
 * </kb-box>
 * ```
 */
@customElement('kb-box')
export class KbBox extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  override render(): TemplateResult {
    const classes = this.buildClasses();
    return html`<div class=${classes || ''}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-box': KbBox;
  }
}
