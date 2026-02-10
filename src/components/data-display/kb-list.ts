import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';

type ListVariant = 'plain' | 'ordered';
type ListSpacing = 'compact' | 'normal' | 'loose';

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

  @property({ type: String }) variant: ListVariant = 'plain';
  @property({ type: String }) spacing: ListSpacing = 'normal';
  @property({ type: Boolean }) dividers: boolean = false;
  @property({ type: Boolean }) interactive: boolean = false;

  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  override render() {
    const classes = this.buildClasses(
      `flex flex-col font-sans ${kbClasses.textPrimary}`,
      SPACING_MAP[this.spacing] ?? SPACING_MAP.normal,
      this.dividers ? '' : '',
    );

    return html`<div role="list" class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-list': KbList;
  }
}
