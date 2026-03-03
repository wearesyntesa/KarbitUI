import { html, nothing, svg, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement, springPressDown, springPressUp } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

let nextAccordionId: number = 0;

const chevronIcon: TemplateResult = svg`<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" fill="none"/>`;

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
export class KbAccordion extends KbBaseElement<'trigger'> {
  static override hostDisplay = 'block' as const;

  private _uid = ++nextAccordionId;
  private _triggerId = `kb-acc-t-${this._uid}`;
  private _panelId = `kb-acc-p-${this._uid}`;

  /** Whether the panel is expanded. Reflected to attribute for CSS targeting. @defaultValue false */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Prevents toggling and applies disabled styles to the trigger button. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;

  private _onPointerDown(e: PointerEvent): void {
    if (this.disabled) return;
    const btn = e.currentTarget as HTMLElement;
    springPressDown(btn, 0.998);
  }

  private _onPointerUp(e: PointerEvent): void {
    const btn = e.currentTarget as HTMLElement;
    springPressUp(btn);
  }

  private _toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
    this.emit('kb-toggle', { open: this.open });
  }

  override render(): TemplateResult {
    const triggerClasses = this.buildClasses(
      'flex items-center justify-between w-full',
      'px-4 py-3.5',
      'font-sans font-semibold text-sm tracking-wide',
      kbClasses.textPrimary,
      'cursor-pointer select-none',
      kbClasses.transitionColors,
      kbClasses.focus,
      'hover:bg-gray-50 dark:hover:bg-zinc-800/60',
      'active:bg-gray-100 dark:active:bg-zinc-700/50',
      this.disabled ? kbClasses.disabled : '',
    );

    const chevronClasses = cx(
      'w-4 h-4 shrink-0 transition-transform duration-200 ease-in-out',
      kbClasses.textSecondary,
      this.open ? 'rotate-180' : '',
    );

    const wrapperClasses = cx(
      'grid transition-[grid-template-rows] duration-200 ease-in-out',
      this.open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
    );

    const triggerEl = this.slotted('trigger');

    return html`
      <div class=${kbClasses.borderBottom}>
        <button
          id=${this._triggerId}
          class=${triggerClasses}
          @click=${this._toggle}
          @pointerdown=${this._onPointerDown}
          @pointerup=${this._onPointerUp}
          @pointerleave=${this._onPointerUp}
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls=${this._panelId}
          aria-disabled=${this.disabled ? 'true' : nothing}
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
