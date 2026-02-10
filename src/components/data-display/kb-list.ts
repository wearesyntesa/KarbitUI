import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';

export type ListVariant = 'plain' | 'ordered';
export type ListSpacing = 'compact' | 'normal' | 'loose';

const SPACING_MAP: Record<ListSpacing, string> = {
  compact: 'gap-0',
  normal: 'gap-1',
  loose: 'gap-2',
};

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
  static override hostDisplay = 'block';

  /** List variant — `'plain'` (unordered) or `'ordered'` (monospace-numbered items). @defaultValue 'plain' */
  @property({ type: String }) variant: ListVariant = 'plain';
  /** Vertical spacing between items. @defaultValue 'normal' */
  @property({ type: String }) spacing: ListSpacing = 'normal';
  /** Show border separators between items. @defaultValue false */
  @property({ type: Boolean }) dividers: boolean = false;
  /** Make all child items hoverable, focusable, and clickable. @defaultValue false */
  @property({ type: Boolean }) interactive: boolean = false;

  override render() {
    const classes = this.buildClasses(
      `flex flex-col font-sans ${kbClasses.textPrimary}`,
      SPACING_MAP[this.spacing] ?? SPACING_MAP.normal,
    );

    return html`<div role="list" class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-list': KbList;
  }
}
