import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { KbListItem } from './kb-list-item.js';

export type ListVariant = 'plain' | 'ordered';
export type ListSpacing = 'compact' | 'normal' | 'loose';

const SPACING_MAP: Record<ListSpacing, string> = {
  compact: 'gap-0',
  normal: 'gap-1',
  loose: 'gap-2',
} as const satisfies Record<ListSpacing, string>;

/**
 * List container for structured item display.
 *
 * Use with `<kb-list-item>` children for full interactivity support.
 * Set `dividers` to show border separators between items.
 * Set `interactive` to make all items hoverable and focusable.
 * Set `variant="ordered"` for monospace-numbered items.
 *
 * @slot - One or more `<kb-list-item>` elements.
 *
 * @example
 * ```html
 * <kb-list dividers>
 *   <kb-list-item>First item</kb-list-item>
 *   <kb-list-item>Second item</kb-list-item>
 * </kb-list>
 * ```
 */
@customElement('kb-list')
export class KbList extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** List variant - `'plain'` (unordered) or `'ordered'` (monospace-numbered items). @defaultValue 'plain' */
  @property({ type: String }) variant: ListVariant = 'plain';
  /** Vertical spacing between items. @defaultValue 'normal' */
  @property({ type: String }) spacing: ListSpacing = 'normal';
  /** Show border separators between items. @defaultValue false */
  @property({ type: Boolean }) dividers: boolean = false;
  /** Make all child items hoverable, focusable, and clickable. @defaultValue false */
  @property({ type: Boolean }) interactive: boolean = false;
  /** Text shown when the list has no items. @defaultValue 'No results' */
  @property({ type: String, attribute: 'empty-text' }) emptyText: string = 'No results';

  private _itemObserver: MutationObserver | undefined;

  @state() private _isEmpty: boolean = true;

  override connectedCallback(): void {
    super.connectedCallback();
    this._isEmpty = this.children.length === 0;
    this._itemObserver = new MutationObserver(() => {
      this._isEmpty = this.children.length === 0;
      this._pushIndices();
    });
    this._itemObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this._itemObserver?.disconnect();
    this._itemObserver = undefined;
    super.disconnectedCallback();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('variant') || changed.has('spacing') || changed.has('dividers') || changed.has('interactive')) {
      this._pushIndices();
    }
  }

  _pushIndices(): void {
    const items = Array.from(this.querySelectorAll<KbListItem>(':scope > kb-list-item'));
    const last = items.length - 1;
    items.forEach((item, i) => {
      item._fromParent(i + 1, i < last);
    });
  }

  override render(): TemplateResult {
    const classes = this.buildClasses(
      `flex flex-col font-sans ${kbClasses.textPrimary}`,
      SPACING_MAP[this.spacing] ?? SPACING_MAP.normal,
    );

    return html`<div role="list" class=${classes}>
      ${
        this._isEmpty
          ? html`<div class="py-6 text-center text-sm font-sans select-none ${kbClasses.textMuted}">${this.emptyText}</div>`
          : this.defaultSlotContent
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-list': KbList;
  }
}
