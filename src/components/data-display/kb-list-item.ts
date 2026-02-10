import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { KbList } from './kb-list.js';

/**
 * Individual list item with optional interactivity, icons, and secondary text.
 *
 * Reads parent `<kb-list>` for `dividers`, `interactive`, and `variant` context.
 * Can override `interactive` and `dividers` at the item level.
 *
 * @slot - Primary content.
 * @slot icon - Leading icon or visual element.
 * @slot secondary - Secondary description text below or beside the primary content.
 * @slot trailing - Trailing content (badge, arrow, etc.) aligned to the right.
 *
 * @fires kb-click - Dispatched when an interactive item is clicked or activated via keyboard.
 *
 * @example
 * ```html
 * <kb-list-item interactive>
 *   <span slot="icon">→</span>
 *   Dashboard
 *   <span slot="secondary">View system metrics</span>
 * </kb-list-item>
 * ```
 */
@customElement('kb-list-item')
export class KbListItem extends KbBaseElement {
  static override hostDisplay = 'block';

  @property({ type: Boolean }) interactive: boolean | undefined = undefined;
  @property({ type: Boolean }) divider: boolean | undefined = undefined;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: String }) href: string = '';
  @property({ type: String }) target: string = '';

  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  private get _parentList(): KbList | null {
    return this.closest('kb-list') as KbList | null;
  }

  private get _isInteractive(): boolean {
    if (this.interactive !== undefined) return this.interactive;
    return this._parentList?.interactive ?? false;
  }

  private get _showDivider(): boolean {
    if (this.divider !== undefined) return this.divider;
    if (!this._parentList?.dividers) return false;
    const siblings = this._parentList.querySelectorAll('kb-list-item');
    const arr = Array.from(siblings);
    return arr.indexOf(this) < arr.length - 1;
  }

  private get _orderIndex(): string | null {
    const parent = this._parentList;
    if (!parent || parent.variant !== 'ordered') return null;
    const items = Array.from(parent.querySelectorAll('kb-list-item'));
    const idx = items.indexOf(this) + 1;
    return idx.toString().padStart(2, '0');
  }

  private _handleClick(): void {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('kb-click', {
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled || !this._isInteractive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  private _renderContent() {
    const iconEl = this.slotted('icon');
    const secondaryEl = this.slotted('secondary');
    const trailingEl = this.slotted('trailing');
    const orderIndex = this._orderIndex;

    return html`
      <div class="flex items-center gap-3 min-w-0">
        ${orderIndex !== null
          ? html`<span class="font-mono text-xs tracking-widest ${kbClasses.textMuted} shrink-0 select-none">${orderIndex}</span>`
          : nothing}
        ${iconEl
          ? html`<span class="shrink-0 ${kbClasses.textSecondary}">${iconEl}</span>`
          : nothing}
        <div class="flex-1 min-w-0">
          <div class="truncate">${this.defaultSlotContent}</div>
          ${secondaryEl
            ? html`<div class="text-sm ${kbClasses.textSecondary} mt-0.5 truncate">${secondaryEl}</div>`
            : nothing}
        </div>
        ${trailingEl
          ? html`<span class="shrink-0 ${kbClasses.textMuted}">${trailingEl}</span>`
          : nothing}
      </div>
    `;
  }

  override render() {
    const isInteractive = this._isInteractive || !!this.href;
    const showDivider = this._showDivider;

    const baseClasses = this.buildClasses(
      `px-3 py-2.5 font-sans text-sm ${kbClasses.textPrimary}`,
      kbClasses.transition,
      showDivider ? kbClasses.borderBottom : '',
      isInteractive && !this.disabled
        ? `cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-zinc-800/60 active:bg-gray-100 dark:active:bg-zinc-700/50 ${kbClasses.focus}`
        : '',
      this.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
      this.href ? 'block no-underline text-inherit' : '',
    );

    if (this.href && !this.disabled) {
      return html`
        <a
          class=${baseClasses}
          href=${this.href}
          target=${this.target || nothing}
          rel=${this.target === '_blank' ? 'noopener noreferrer' : nothing}
          role="listitem"
        >
          ${this._renderContent()}
        </a>
      `;
    }

    return html`
      <div
        class=${baseClasses}
        role="listitem"
        tabindex=${isInteractive && !this.disabled ? '0' : nothing}
        @click=${isInteractive ? this._handleClick : nothing}
        @keydown=${isInteractive ? this._handleKeyDown : nothing}
      >
        ${this._renderContent()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-list-item': KbListItem;
  }
}
