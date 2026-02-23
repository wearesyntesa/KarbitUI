import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { KbAccordion } from './kb-accordion.js';

/**
 * Groups `<kb-accordion>` items and manages their open/closed state.
 *
 * By default only one item can be open at a time (exclusive mode).
 * Set `allowMultiple` to let users open several items simultaneously.
 *
 * @slot - One or more `<kb-accordion>` elements.
 *
 * @example
 * ```html
 * <kb-accordion-group>
 *   <kb-accordion><span slot="trigger">One</span>Content one</kb-accordion>
 *   <kb-accordion><span slot="trigger">Two</span>Content two</kb-accordion>
 * </kb-accordion-group>
 * ```
 */
@customElement('kb-accordion-group')
export class KbAccordionGroup extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** When false (default), opening one item closes all others. */
  @property({ type: Boolean, attribute: 'allow-multiple' }) allowMultiple: boolean = false;

  private _items: KbAccordion[] = [];
  private _itemObserver: MutationObserver | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this._items = Array.from(this.querySelectorAll<KbAccordion>('kb-accordion'));
    this._itemObserver = new MutationObserver(() => {
      this._items = Array.from(this.querySelectorAll<KbAccordion>('kb-accordion'));
    });
    this._itemObserver.observe(this, { childList: true });
    this.addEventListener('kb-toggle', this._handleItemToggle as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._itemObserver?.disconnect();
    this._itemObserver = undefined;
    this.removeEventListener('kb-toggle', this._handleItemToggle as EventListener);
  }

  private _handleItemToggle = (e: CustomEvent<{ open: boolean }>): void => {
    if (this.allowMultiple) return;

    const target = e.target as KbAccordion;
    if (!target.open) return;

    for (const item of this._items) {
      if (item !== target && item.open) {
        item.open = false;
      }
    }
  };

  override render(): TemplateResult {
    return html`<div class=${this.buildClasses()}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-accordion-group': KbAccordionGroup;
  }
}
