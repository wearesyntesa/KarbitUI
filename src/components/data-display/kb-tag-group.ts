import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { StyleProps } from '../../core/style-map.js';
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

  /** Exclude `gap` from style-props system — this component owns the `gap` property directly. */
  protected override collectStyleProps(): Partial<StyleProps> {
    const props = super.collectStyleProps();
    delete props.gap;
    return props;
  }

  private _indicator: HTMLElement | null = null;
  private _dragOverTag: Element | null = null;
  private _insertBefore: boolean = true;

  private _getTagChildren(): KbTag[] {
    const container = this._getContainer();
    if (!container) return [];
    return Array.from(container.querySelectorAll(':scope > kb-tag')) as KbTag[];
  }

  private _getContainer(): HTMLElement | null {
    return this.renderRoot.querySelector('[data-kb-tag-group]');
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

  private _handleDragOver = (e: DragEvent): void => {
    if (!this.reorderable) return;
    if (!e.dataTransfer?.types.includes('application/kb-tag')) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

    const container = this._getContainer();
    if (!container) return;

    const tags = this._getTagChildren();
    if (tags.length === 0) return;

    let closestTag: Element | null = null;
    let insertBefore = true;
    let minDist = Infinity;

    for (const tag of tags) {
      const rect = tag.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - midX);
      if (dist < minDist) {
        minDist = dist;
        closestTag = tag;
        insertBefore = e.clientX < midX;
      }
    }

    if (!closestTag) return;

    this._dragOverTag = closestTag;
    this._insertBefore = insertBefore;

    const indicator = this._ensureIndicator();
    indicator.style.opacity = '1';

    if (insertBefore) {
      container.insertBefore(indicator, closestTag);
    } else {
      const next = closestTag.nextElementSibling;
      if (next && next !== indicator) {
        container.insertBefore(indicator, next);
      } else if (!next) {
        container.appendChild(indicator);
      }
    }
  };

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
    if (tagValue === undefined) return;

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
    if (this._indicator) {
      this._indicator.style.opacity = '0';
      this._indicator.remove();
    }
    this._dragOverTag = null;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._hideIndicator();
    this._indicator = null;
  }

  override render(): TemplateResult {
    const gapClass = GAP_MAP[this.gap] ?? GAP_MAP.md;
    const classes = this.buildClasses('flex flex-wrap items-center', gapClass);

    return html`
      <div
        class=${classes}
        data-kb-tag-group
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
