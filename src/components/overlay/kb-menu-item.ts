import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

/**
 * Individual menu item for use inside `kb-dropdown-menu`.
 *
 * @fires kb-select - Dispatched when the item is activated (click, Enter, or Space).
 */
export class KbMenuItem extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Value emitted in the `kb-select` event detail. */
  @property({ type: String }) value: string = '';
  /** Disable interaction on this item. */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  /** Apply destructive/danger styling (red text). */
  @property({ type: Boolean, reflect: true }) destructive: boolean = false;

  private _handleClick(): void {
    if (this.disabled) return;
    this.emit('kb-select', { value: this.value });
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.emit('kb-select', { value: this.value });
    }
  }

  override render(): TemplateResult {
    const classes = cx(
      'flex items-center w-full px-3 py-2 text-sm font-sans cursor-pointer select-none',
      kbClasses.transitionColors,
      this.destructive
        ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
        : cx(kbClasses.textPrimary, 'hover:bg-gray-50 dark:hover:bg-zinc-800'),
      this.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
    );

    return html`
      <div
        class=${classes}
        role="menuitem"
        tabindex="-1"
        data-value=${this.value}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >${this.defaultSlotContent}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-menu-item': KbMenuItem;
  }
}
