import { html, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { KbToggleDetail } from '../../core/events.js';

let nextAccordionId = 0;

const chevronIcon = svg`<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none"/>`;

/**
 * Collapsible content panel with smooth expand/collapse animation.
 *
 * Use standalone or inside `<kb-accordion-group>` for exclusive/multiple open behavior.
 *
 * @slot trigger - Clickable header that toggles the panel.
 * @slot - Panel body content (hidden when collapsed).
 *
 * @fires kb-toggle - Dispatched when open state changes, with `detail.open`.
 *
 * @example
 * ```html
 * <kb-accordion>
 *   <span slot="trigger">Section title</span>
 *   <p>Expanded content goes here.</p>
 * </kb-accordion>
 * ```
 */
@customElement('kb-accordion')
export class KbAccordion extends KbBaseElement {
  static override hostDisplay = 'block';

  private _uid = ++nextAccordionId;
  private get _triggerId(): string { return `kb-acc-t-${this._uid}`; }
  private get _panelId(): string { return `kb-acc-p-${this._uid}`; }

  /** Whether the panel is expanded. Reflected to attribute for CSS targeting. @defaultValue false */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Prevents toggling and applies disabled styles to the trigger button. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;

  @state() private _pressed = false;

  private _onPointerDown(): void {
    if (this.disabled) return;
    this._pressed = true;
  }

  private _onPointerUp(): void {
    this._pressed = false;
  }

  private _toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent<KbToggleDetail>('kb-toggle', {
      detail: { open: this.open },
      bubbles: true,
      composed: true,
    }));
  }

  override render() {
    const pressClass = this._pressed && !this.disabled ? 'scale-[0.998]' : '';

    const triggerClasses = this.buildClasses(
      'flex items-center justify-between w-full',
      'px-4 py-3.5',
      'font-sans font-semibold text-sm tracking-wide',
      kbClasses.textPrimary,
      'cursor-pointer select-none',
      kbClasses.transition,
      kbClasses.focus,
      'hover:bg-gray-50 dark:hover:bg-zinc-800/60',
      'active:bg-gray-100 dark:active:bg-zinc-700/50',
      this.disabled ? kbClasses.disabled : '',
      pressClass,
    );

    const chevronClasses = [
      'w-4 h-4 shrink-0 transition-transform duration-200 ease-in-out',
      kbClasses.textSecondary,
      this.open ? 'rotate-180' : '',
    ].join(' ');

    const wrapperClasses = [
      'grid transition-[grid-template-rows] duration-200 ease-in-out',
      this.open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
    ].join(' ');

    const triggerEl = this.slotted('trigger');

    return html`
      <div class=${`${kbClasses.borderBottom}`}>
        <button
          id=${this._triggerId}
          class=${triggerClasses}
          @click=${this._toggle}
          @pointerdown=${() => this._onPointerDown()}
          @pointerup=${() => this._onPointerUp()}
          @pointerleave=${() => this._onPointerUp()}
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls=${this._panelId}
          ?disabled=${this.disabled}
        >
          <span class="flex-1 text-left">${triggerEl}</span>
          <svg class=${chevronClasses} viewBox="0 0 24 24" aria-hidden="true">${chevronIcon}</svg>
        </button>
        <div class=${wrapperClasses}>
          <div class="overflow-hidden">
            <div
              id=${this._panelId}
              class=${`px-4 pb-4 pt-1 font-sans text-sm ${kbClasses.textSecondary}`}
              role="region"
              aria-labelledby=${this._triggerId}
            >
              ${this.defaultSlotContent}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-accordion': KbAccordion;
  }
}
