import { html, isServer, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { ComponentSize, Orientation } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import type { KbStep } from './kb-step.js';

/**
 * Multi-step wizard/progress indicator.
 *
 * Distributes status (`complete`, `current`, `upcoming`) to child `<kb-step>` elements
 * based on the `current` index. Completed steps are clickable and fire `kb-step-click`.
 *
 * @slot - One or more `<kb-step>` elements.
 *
 * @fires kb-step-click - Dispatched when a completed step is clicked, with `detail.index`.
 *
 * @example
 * ```html
 * <kb-steps current="1">
 *   <kb-step label="Account"></kb-step>
 *   <kb-step label="Profile"></kb-step>
 *   <kb-step label="Review"></kb-step>
 * </kb-steps>
 * ```
 */
export class KbSteps extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Zero-based index of the current step. */
  @property({ type: Number }) current: number = 0;

  /** Layout direction. */
  @property({ type: String }) orientation: Orientation = 'horizontal';

  /** Step indicator size. */
  @property({ type: String }) size: ComponentSize = 'md';

  private _items: KbStep[] = [];
  private _itemObserver: MutationObserver | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    if (isServer) return;
    this._queryItems();
    this._itemObserver = new MutationObserver(() => {
      this._queryItems();
      this._distributeStatus();
      this.requestUpdate();
    });
    this._itemObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (isServer) return;
    this._itemObserver?.disconnect();
    this._itemObserver = undefined;
  }

  override updated(_changed: Map<PropertyKey, unknown>): void {
    this._distributeStatus();
  }

  private _queryItems(): void {
    this._items = Array.from(this.querySelectorAll<KbStep>('kb-step'));
  }

  private _distributeStatus(): void {
    const items = this._items;
    const len = items.length;
    for (let i = 0; i < len; i++) {
      const child: KbStep | undefined = items[i];
      if (!child) continue;
      let status: 'complete' | 'current' | 'upcoming' = 'upcoming';
      if (i < this.current) status = 'complete';
      else if (i === this.current) status = 'current';
      child._status = status;
      child._index = i;
      child._size = this.size;
      child._orientation = this.orientation;
      child._isLast = i === len - 1;
      child.dataset.status = status;
    }
  }

  override render(): TemplateResult {
    const isVertical = this.orientation === 'vertical';

    const containerClasses = cx('flex', isVertical ? 'flex-col' : 'flex-row items-start');

    return html`<div class=${this.buildClasses(containerClasses)}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-steps': KbSteps;
  }
}
