import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { dismissWithAnimation, KbBaseElement } from '../../core/base-element.js';
import { renderCloseIcon, STATUS_ICONS } from '../../core/icons.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
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
      'left-accent': `bg-white dark:bg-transparent border ${kbClasses.borderColor} border-l-4`,
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
    {
      status: 'info',
      variant: 'outline',
      class: 'border-blue-500 text-blue-700 dark:text-blue-400 dark:border-blue-500',
    },
    {
      status: 'success',
      variant: 'outline',
      class: 'border-green-500 text-green-700 dark:text-green-400 dark:border-green-500',
    },
    {
      status: 'warning',
      variant: 'outline',
      class: 'border-yellow-500 text-yellow-700 dark:text-yellow-400 dark:border-yellow-500',
    },
    { status: 'error', variant: 'outline', class: 'border-red-500 text-red-700 dark:text-red-400 dark:border-red-500' },
    { status: 'info', variant: 'subtle', class: 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
    { status: 'success', variant: 'subtle', class: 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300' },
    {
      status: 'warning',
      variant: 'subtle',
      class: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    },
    { status: 'error', variant: 'subtle', class: 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300' },
    { status: 'info', variant: 'left-accent', class: 'border-l-blue-500 text-blue-800 dark:text-blue-300' },
    { status: 'success', variant: 'left-accent', class: 'border-l-green-500 text-green-800 dark:text-green-300' },
    { status: 'warning', variant: 'left-accent', class: 'border-l-yellow-500 text-yellow-800 dark:text-yellow-300' },
    { status: 'error', variant: 'left-accent', class: 'border-l-red-500 text-red-800 dark:text-red-300' },
  ],
});

export type AlertStatus = InferVariant<typeof alertRecipe, 'status'>;
export type AlertVariant = InferVariant<typeof alertRecipe, 'variant'>;

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
export class KbAlert extends KbBaseElement<'title' | 'action' | 'detail' | 'icon'> {
  static override hostDisplay = 'block' as const;
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
    this.emit('kb-close');
    dismissWithAnimation(this, '[data-kb-alert-outer]', 300);
  }

  private _toggleDetail(): void {
    this._detailOpen = !this._detailOpen;
    this.emit('kb-toggle', { open: this._detailOpen });
  }

  override render(): TemplateResult {
    const recipeClasses = alertRecipe({ status: this.status, variant: this.variant, size: this.size });

    const outerClasses = this._dismissing
      ? 'grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-in-out'
      : 'grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-200 ease-in-out animate-kb-fade-in';

    const classes = this.buildClasses(recipeClasses);

    const titleEl = this.slotted('title');
    const actionEl = this.slotted('action');
    const detailEl = this.slotted('detail');

    const closeIcon = renderCloseIcon('w-4 h-4', 2.5);
    const chevronIcon = html`<svg class="w-3.5 h-3.5 transition-transform duration-200 ease-in-out ${this._detailOpen ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>`;

    return html`
      <div data-kb-alert-outer class=${outerClasses}>
        <div class="overflow-hidden">
          <div class=${classes} role="alert">
            ${
              this.showIcon
                ? html`<span class="flex-shrink-0 mt-0.5" aria-hidden="true">
                  ${this.slotted('icon') ?? STATUS_ICONS[this.status]}
                </span>`
                : nothing
            }
            <div class="flex-1 min-w-0 font-sans">
              ${titleEl ? html`<div class="font-semibold mb-0.5">${titleEl}</div>` : nothing}
              <div>${this.defaultSlotContent}</div>
              ${
                detailEl
                  ? html`
                  <div class="grid ${this._detailOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 ease-in-out">
                    <div class="overflow-hidden">
                      <div class="pt-2 text-sm opacity-80">${detailEl}</div>
                    </div>
                  </div>
                `
                  : nothing
              }
              ${actionEl ? html`<div class="mt-2 flex items-center gap-2">${actionEl}</div>` : nothing}
            </div>
            <div class="flex items-center gap-1 flex-shrink-0 ml-auto">
              ${
                detailEl
                  ? html`<button
                    class="cursor-pointer p-1 opacity-50 hover:opacity-100 ${kbClasses.transition} bg-transparent border-none text-current"
                    @click=${this._toggleDetail}
                    aria-label=${this._detailOpen ? 'Hide details' : 'Show details'}
                    aria-expanded=${this._detailOpen ? 'true' : 'false'}
                  >${chevronIcon}</button>`
                  : nothing
              }
              ${
                this.closable
                  ? html`<button
                    class="cursor-pointer p-1 opacity-50 hover:opacity-100 ${kbClasses.transition} bg-transparent border-none text-current"
                    @click=${this._dismiss}
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
