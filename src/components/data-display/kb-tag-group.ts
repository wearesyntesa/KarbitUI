import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { KbDragDetail } from '../../core/events.js';
import type { KbTag } from './kb-tag.js';

export type TagGroupGap = 'sm' | 'md' | 'lg';

const GAP_MAP: Record<TagGroupGap, string> = {
  sm: 'gap-1.5',
  md: 'gap-2.5',
  lg: 'gap-4',
} as const satisfies Record<TagGroupGap, string>;

const INDICATOR_CLASSES =
  'w-0.5 h-5 bg-blue-500 rounded-full shrink-0 transition-opacity duration-100 pointer-events-none';

/**
 * Flex-wrap container for `kb-tag` elements with optional drag-and-drop reordering.
 *
 * When `reorderable` is set, child `kb-tag[kb-draggable]` elements can be dragged
 * to reorder. A thin blue drop indicator appears between tags at the insertion point.
 * After a drop, fires `kb-reorder` with the new value order.
 *
 * @fires kb-reorder - Fired after drag reorder completes. `detail.order` is an array of tag `value` strings.
 * @fires kb-drag-start - Fired when a tag drag begins. `detail.value` is the dragged tag value.
 * @fires kb-drag-end - Fired when a tag drag ends. `detail.value` is the dragged tag value.
 *
 * @example
 * ```html
 * <kb-tag-group reorderable>
 *   <kb-tag kb-draggable value="a">Alpha</kb-tag>
 *   <kb-tag kb-draggable value="b">Beta</kb-tag>
 *   <kb-tag kb-draggable value="c">Gamma</kb-tag>
 * </kb-tag-group>
 * ```
 */
@customElement('kb-tag-group')
export class KbTagGroup extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Enable drag-and-drop reordering of child `kb-tag[kb-draggable]` elements. @defaultValue false */
  @property({ type: Boolean }) reorderable: boolean = false;
  /** Spacing between tags. @defaultValue 'md' */
  @property({ type: String }) gap: TagGroupGap = 'md';

  /** Exclude `gap` from style-props system - this component owns the `gap` property directly. */
  protected override _excludedStyleProps: ReadonlySet<string> = new Set(['gap']);

  private _indicator: HTMLElement | null = null;
  private _dragOverTag: Element | null = null;
  private _insertBefore: boolean = true;
  private _dragRects: Map<Element, DOMRect> = new Map();
  private _containerEl: HTMLElement | null = null;
  /** R-3: RAF handle for throttling dragover. */
  private _rafId: number = 0;

  override firstUpdated(): void {
    this._containerEl = this.querySelector('[data-kb-tag-group]');
  }

  private _getTagChildren(): KbTag[] {
    const container = this._getContainer();
    if (!container) return [];
    return Array.from(container.querySelectorAll(':scope > kb-tag')) as KbTag[];
  }

  /** D-1: Lazy getter — falls back to querySelector if firstUpdated hasn't run yet. */
  private _getContainer(): HTMLElement | null {
    if (!this._containerEl) {
      this._containerEl = this.querySelector('[data-kb-tag-group]');
    }
    return this._containerEl;
  }
  private _ensureIndicator(): HTMLElement {
    if (!this._indicator) {
      this._indicator = document.createElement('div');
      this._indicator.setAttribute('data-kb-drop-indicator', '');
      this._indicator.className = INDICATOR_CLASSES;
      this._indicator.style.opacity = '0';
    }
    return this._indicator;
  }

  /** U-1: Emit kb-drag-start with the dragged tag value. */
  private _handleDragStart = (e: DragEvent): void => {
    this._dragRects.clear();
    for (const tag of this._getTagChildren()) {
      this._dragRects.set(tag, tag.getBoundingClientRect());
    }

    const value = e.dataTransfer?.getData('application/kb-tag') ?? '';
    if (value) {
      this.emit('kb-drag-start', { value } satisfies KbDragDetail);
    }
  };

  /** U-1: Emit kb-drag-end with the dragged tag value. */
  private _handleDragEnd = (e: DragEvent): void => {
    this._dragRects.clear();

    const value = e.dataTransfer?.getData('application/kb-tag') ?? '';
    if (value) {
      this.emit('kb-drag-end', { value } satisfies KbDragDetail);
    }
  };

  /** R-3: RAF-throttled dragover handler to avoid per-frame layout thrash. */
  private _handleDragOver = (e: DragEvent): void => {
    if (!this.reorderable) return;
    if (!e.dataTransfer?.types.includes('application/kb-tag')) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

    if (this._rafId) return;
    const clientX = e.clientX;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = 0;
      this._updateDropPosition(clientX);
    });
  };

  private _updateDropPosition(clientX: number): void {
    const container = this._getContainer();
    if (!container) return;

    const tags = this._getTagChildren();
    if (tags.length === 0) return;

    let closestTag: Element | null = null;
    let insertBefore = true;
    let minDist = Infinity;

    for (const tag of tags) {
      const rect = this._dragRects.get(tag) ?? tag.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - midX);
      if (dist < minDist) {
        minDist = dist;
        closestTag = tag;
        insertBefore = clientX < midX;
      }
    }

    if (!closestTag) return;

    this._dragOverTag = closestTag;
    this._insertBefore = insertBefore;

    const indicator = this._ensureIndicator();
    indicator.style.opacity = '1';

    this._positionIndicator(container, indicator, closestTag, insertBefore);
  }

  private _positionIndicator(container: HTMLElement, indicator: HTMLElement, anchor: Element, before: boolean): void {
    if (before) {
      container.insertBefore(indicator, anchor);
      return;
    }
    const next = anchor.nextElementSibling;
    if (next && next !== indicator) {
      container.insertBefore(indicator, next);
    } else if (!next) {
      container.appendChild(indicator);
    }
  }

  private _handleDragLeave = (e: DragEvent): void => {
    const container = this._getContainer();
    if (!container) return;
    const related = e.relatedTarget as Node | null;
    if (related && container.contains(related)) return;
    this._hideIndicator();
  };

  private _handleDrop = (e: DragEvent): void => {
    e.preventDefault();
    if (!this.reorderable) return;

    const tagValue = e.dataTransfer?.getData('application/kb-tag');
    /** T-5: getData() returns '' (not undefined) when key absent — use falsy check. */
    if (!tagValue) return;

    const targetTag = this._dragOverTag;
    const insertBefore = this._insertBefore;

    this._hideIndicator();

    const container = this._getContainer();
    if (!(container && targetTag)) return;

    const tags = this._getTagChildren();
    const draggedTag = tags.find((t) => (t.value || t.textContent?.trim() || '') === tagValue);
    if (!draggedTag || draggedTag === targetTag) return;

    if (insertBefore) {
      container.insertBefore(draggedTag, targetTag);
    } else {
      const next = targetTag.nextElementSibling;
      if (next) {
        container.insertBefore(draggedTag, next);
      } else {
        container.appendChild(draggedTag);
      }
    }

    const order = this._getTagChildren().map((t) => t.value || t.textContent?.trim() || '');
    this.emit('kb-reorder', { order });
  };

  private _hideIndicator(): void {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = 0;
    }
    if (this._indicator) {
      this._indicator.style.opacity = '0';
      this._indicator.remove();
    }
    this._dragOverTag = null;
    this._dragRects.clear();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._hideIndicator();
    this._indicator = null;
    this._containerEl = null;
  }

  override render(): TemplateResult {
    const gapClass = GAP_MAP[this.gap] ?? GAP_MAP.md;
    const classes = this.buildClasses('flex flex-wrap items-center', gapClass);

    return html`
      <div
        class=${classes}
        data-kb-tag-group
        @dragstart=${this._handleDragStart}
        @dragend=${this._handleDragEnd}
        @dragover=${this._handleDragOver}
        @dragleave=${this._handleDragLeave}
        @drop=${this._handleDrop}
      >
        ${this.defaultSlotContent}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-tag-group': KbTagGroup;
  }
}
