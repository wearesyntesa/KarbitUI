import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement, dismissWithAnimation } from '../../core/base-element.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { KbToggleDetail } from '../../core/events.js';

export type AlertStatus = 'info' | 'success' | 'warning' | 'error';
export type AlertVariant = 'solid' | 'outline' | 'subtle' | 'left-accent';

const STATUS_ICONS: Record<AlertStatus, TemplateResult> = {
  info: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`,
  warning: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  error: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
};

const alertRecipe = recipe({
  base: `flex items-start gap-3 font-sans w-full select-none`,
  variants: {
    status: {
      info: '',
      success: '',
      warning: '',
      error: '',
    },
    variant: {
      solid: '',
      outline: 'bg-white dark:bg-transparent border',
      subtle: 'border border-transparent',
      'left-accent': `bg-white dark:bg-transparent border border-gray-200 dark:border-zinc-700 border-l-4`,
    },
    size: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-5 py-4 text-base',
    },
  },
  defaultVariants: { status: 'info', variant: 'subtle', size: 'md' },
  compoundVariants: [
    { status: 'info', variant: 'solid', class: 'bg-blue-500 text-white border border-blue-500' },
    { status: 'success', variant: 'solid', class: 'bg-green-500 text-white border border-green-500' },
    { status: 'warning', variant: 'solid', class: 'bg-yellow-400 text-slate-900 border border-yellow-400' },
    { status: 'error', variant: 'solid', class: 'bg-red-500 text-white border border-red-500' },
    { status: 'info', variant: 'outline', class: 'border-blue-500 text-blue-700 dark:text-blue-400 dark:border-blue-500' },
    { status: 'success', variant: 'outline', class: 'border-green-500 text-green-700 dark:text-green-400 dark:border-green-500' },
    { status: 'warning', variant: 'outline', class: 'border-yellow-500 text-yellow-700 dark:text-yellow-400 dark:border-yellow-500' },
    { status: 'error', variant: 'outline', class: 'border-red-500 text-red-700 dark:text-red-400 dark:border-red-500' },
    { status: 'info', variant: 'subtle', class: 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    { status: 'success', variant: 'subtle', class: 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300' },
    { status: 'warning', variant: 'subtle', class: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' },
    { status: 'error', variant: 'subtle', class: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300' },
    { status: 'info', variant: 'left-accent', class: 'border-l-blue-500 text-blue-800 dark:text-blue-300' },
    { status: 'success', variant: 'left-accent', class: 'border-l-green-500 text-green-800 dark:text-green-300' },
    { status: 'warning', variant: 'left-accent', class: 'border-l-yellow-500 text-yellow-800 dark:text-yellow-300' },
    { status: 'error', variant: 'left-accent', class: 'border-l-red-500 text-red-800 dark:text-red-300' },
  ],
});

/**
 * Status alert banner for displaying feedback messages.
 *
 * Supports animated entry and dismiss, auto-dismiss timer, expandable
 * detail section, title/action slots, and clean SVG status icons.
 *
 * @slot - Alert message content (description).
 * @slot icon - Custom icon override.
 * @slot title - Bold heading rendered above the description.
 * @slot action - Inline action area (buttons, links) rendered after content.
 * @slot detail - Expandable detail content toggled via a chevron button.
 *
 * @fires kb-close - Dispatched when the alert is dismissed (closable or auto-dismiss).
 * @fires kb-toggle - Dispatched when collapsible detail is expanded/collapsed.
 *
 * @example
 * ```html
 * <kb-alert status="success" variant="solid">Operation complete</kb-alert>
 * <kb-alert status="error" closable>
 *   <span slot="title">Deployment Failed</span>
 *   Pipeline encountered 3 errors during build phase.
 *   <span slot="action"><kb-button variant="ghost" size="xs">RETRY</kb-button></span>
 * </kb-alert>
 * <kb-alert status="warning" closable duration="5000">Auto-dismissing warning</kb-alert>
 * ```
 */
@customElement('kb-alert')
export class KbAlert extends KbBaseElement {
  static override hostDisplay = 'block';
  override connectedCallback(): void {
    super.connectedCallback();
    this._startTimer();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearTimer();
  }

  /** Semantic status controlling icon and color scheme. @defaultValue 'info' */
  @property({ type: String }) status: AlertStatus = 'info';
  /** Visual variant controlling border, background, and text styles. @defaultValue 'subtle' */
  @property({ type: String }) variant: AlertVariant = 'subtle';
  /** Alert size controlling padding and font size. @defaultValue 'md' */
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
  /** Show a close button that dismisses the alert with animation. @defaultValue false */
  @property({ type: Boolean }) closable: boolean = false;
  /** Show the status icon before the message content. @defaultValue true */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon: boolean = true;
  /** Auto-dismiss delay in milliseconds. `0` disables auto-dismiss. @defaultValue 0 */
  @property({ type: Number }) duration: number = 0;

  @state() private _dismissing = false;
  @state() private _detailOpen = false;

  private _timerId: ReturnType<typeof setTimeout> | undefined;

  private _startTimer(): void {
    if (this.duration > 0) {
      this._timerId = setTimeout(() => this._dismiss(), this.duration);
    }
  }

  private _clearTimer(): void {
    if (this._timerId !== undefined) {
      clearTimeout(this._timerId);
      this._timerId = undefined;
    }
  }

  private _dismiss(): void {
    this._clearTimer();
    this._dismissing = true;
    this.dispatchEvent(new CustomEvent('kb-close', { bubbles: true, composed: true }));
    dismissWithAnimation(this, '[data-kb-alert-outer]', 300);
  }

  private _toggleDetail(): void {
    this._detailOpen = !this._detailOpen;
    this.dispatchEvent(
      new CustomEvent<KbToggleDetail>('kb-toggle', {
        bubbles: true,
        composed: true,
        detail: { open: this._detailOpen },
      }),
    );
  }

  override render() {
    const recipeClasses = alertRecipe({ status: this.status, variant: this.variant, size: this.size });

    const outerClasses = this._dismissing
      ? 'grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-in-out'
      : 'grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-200 ease-in-out animate-kb-fade-in';

    const classes = this.buildClasses(recipeClasses);

    const titleEl = this.slotted('title');
    const actionEl = this.slotted('action');
    const detailEl = this.slotted('detail');

    const closeIcon = html`<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    const chevronIcon = html`<svg class="w-3.5 h-3.5 transition-transform duration-200 ease-in-out ${this._detailOpen ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>`;

    return html`
      <div data-kb-alert-outer class=${outerClasses}>
        <div class="overflow-hidden">
          <div class=${classes} role="alert">
            ${this.showIcon
              ? html`<span class="flex-shrink-0 mt-0.5" aria-hidden="true">
                  ${this.slotted('icon') ?? STATUS_ICONS[this.status]}
                </span>`
              : nothing
            }
            <div class="flex-1 min-w-0 font-sans">
              ${titleEl
                ? html`<div class="font-semibold mb-0.5">${titleEl}</div>`
                : nothing
              }
              <div>${this.defaultSlotContent}</div>
              ${detailEl
                ? html`
                  <div class="grid ${this._detailOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 ease-in-out">
                    <div class="overflow-hidden">
                      <div class="pt-2 text-sm opacity-80">${detailEl}</div>
                    </div>
                  </div>
                `
                : nothing
              }
              ${actionEl
                ? html`<div class="mt-2 flex items-center gap-2">${actionEl}</div>`
                : nothing
              }
            </div>
            <div class="flex items-center gap-1 flex-shrink-0 ml-auto">
              ${detailEl
                ? html`<button
                    class="cursor-pointer p-1 opacity-50 hover:opacity-100 ${kbClasses.transition} bg-transparent border-none text-current"
                    @click=${() => this._toggleDetail()}
                    aria-label=${this._detailOpen ? 'Hide details' : 'Show details'}
                    aria-expanded=${this._detailOpen ? 'true' : 'false'}
                  >${chevronIcon}</button>`
                : nothing
              }
              ${this.closable
                ? html`<button
                    class="cursor-pointer p-1 opacity-50 hover:opacity-100 ${kbClasses.transition} bg-transparent border-none text-current"
                    @click=${() => this._dismiss()}
                    aria-label="Close alert"
                  >${closeIcon}</button>`
                : nothing
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-alert': KbAlert;
  }
}
