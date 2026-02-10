import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement, dismissWithAnimation } from '../../core/base-element.js';
import type { StyleProps } from '../../core/style-map.js';
import { kbClasses } from '../../core/theme.js';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

const STATUS_ICONS: Record<ToastStatus, TemplateResult> = {
  info: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`,
  warning: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  error: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
};

const STATUS_BORDER: Record<ToastStatus, string> = {
  info: 'border-l-blue-500',
  success: 'border-l-green-500',
  warning: 'border-l-yellow-500',
  error: 'border-l-red-500',
};

const STATUS_ICON_COLOR: Record<ToastStatus, string> = {
  info: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
};

const PROGRESS_COLOR: Record<ToastStatus, string> = {
  info: 'bg-blue-500 dark:bg-blue-400',
  success: 'bg-green-500 dark:bg-green-400',
  warning: 'bg-yellow-500 dark:bg-yellow-400',
  error: 'bg-red-500 dark:bg-red-400',
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top': 'fixed top-4 left-1/2 -translate-x-1/2',
  'top-right': 'fixed top-4 right-4',
  'top-left': 'fixed top-4 left-4',
  'bottom': 'fixed bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'fixed bottom-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
};

const ENTER_ANIMATION: Record<ToastPosition, string> = {
  'top': 'animate-kb-slide-in-down',
  'top-right': 'animate-kb-slide-in-down',
  'top-left': 'animate-kb-slide-in-down',
  'bottom': 'animate-kb-slide-in-up',
  'bottom-right': 'animate-kb-slide-in-up',
  'bottom-left': 'animate-kb-slide-in-up',
};

const isTopPosition = (pos: ToastPosition): boolean =>
  pos === 'top' || pos === 'top-right' || pos === 'top-left';

/**
 * Notification toast popup with position-aware slide animations,
 * auto-dismiss countdown bar, pause-on-hover, and action slot.
 *
 * @slot - Toast message content.
 * @slot title - Optional bold title above the message.
 * @slot action - Inline action area (buttons, links).
 *
 * @fires kb-close - Dispatched when the toast is dismissed.
 *
 * @example
 * ```html
 * <kb-toast status="success" position="top-right" duration="5000">
 *   <span slot="title">SAVED</span>
 *   Configuration updated successfully.
 * </kb-toast>
 * ```
 */
@customElement('kb-toast')
export class KbToast extends KbBaseElement {
  static override hostDisplay = 'block';

  /** Semantic status controlling icon, border accent, and progress bar color. @defaultValue 'info' */
  @property({ type: String }) status: ToastStatus = 'info';
  /** Screen position where the toast appears. @defaultValue 'top-right' */
  @property({ type: String }) position: ToastPosition = 'top-right';
  /** Auto-dismiss delay in milliseconds. Pauses on hover. @defaultValue 5000 */
  @property({ type: Number }) duration: number = 5000;
  /** Show a close button for manual dismissal. @defaultValue true */
  @property({ type: Boolean }) closable: boolean = true;
  /** Show the status icon before the message content. @defaultValue true */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon: boolean = true;

  @state() private _dismissing = false;
  @state() private _paused = false;

  private _timerId: ReturnType<typeof setTimeout> | undefined;
  private _startTime = 0;
  private _remaining = 0;

  protected override collectStyleProps(): Partial<StyleProps> {
    const props = super.collectStyleProps();
    delete props.position;
    return props;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._remaining = this.duration;
    this._startTimer();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearTimer();
  }

  private _startTimer(): void {
    if (this._remaining > 0) {
      this._startTime = Date.now();
      this._timerId = setTimeout(() => this._dismiss(), this._remaining);
    }
  }

  private _clearTimer(): void {
    if (this._timerId !== undefined) {
      clearTimeout(this._timerId);
      this._timerId = undefined;
    }
  }

  private _onMouseEnter(): void {
    if (this._remaining <= 0 || this._dismissing) return;
    this._clearTimer();
    const elapsed = Date.now() - this._startTime;
    this._remaining = Math.max(0, this._remaining - elapsed);
    this._paused = true;
  }

  private _onMouseLeave(): void {
    if (this._remaining <= 0 || this._dismissing) return;
    this._paused = false;
    this._startTimer();
  }

  private _dismiss(): void {
    if (this._dismissing) return;
    this._clearTimer();
    this._dismissing = true;
    this.dispatchEvent(new CustomEvent('kb-close', { bubbles: true, composed: true }));
    dismissWithAnimation(this, '[data-kb-toast]', 350);
  }

  override render() {
    const posClasses = POSITION_CLASSES[this.position] ?? POSITION_CLASSES['top-right'];
    const statusBorder = STATUS_BORDER[this.status] ?? STATUS_BORDER.info;
    const enterAnim = ENTER_ANIMATION[this.position] ?? 'animate-kb-slide-in-down';
    const iconColor = STATUS_ICON_COLOR[this.status] ?? STATUS_ICON_COLOR.info;

    const exitTranslate = isTopPosition(this.position)
      ? '-translate-y-[calc(100%+1rem)]'
      : 'translate-y-[calc(100%+1rem)]';

    const dismissClasses = this._dismissing
      ? `opacity-0 ${exitTranslate}`
      : `opacity-100 ${enterAnim}`;

    const classes = this.buildClasses(
      `z-50 flex flex-col min-w-[300px] max-w-md ${kbClasses.border} border-l-4 ${kbClasses.surface} font-sans select-none overflow-hidden transition-[opacity,transform] duration-300 ease-in-out`,
      posClasses,
      statusBorder,
      dismissClasses,
    );

    const titleEl = this.slotted('title');
    const actionEl = this.slotted('action');

    const closeIcon = html`<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

    const progressBar = this.duration > 0
      ? html`<span
          class="block h-0.5 ${PROGRESS_COLOR[this.status] ?? PROGRESS_COLOR.info}"
          style="animation:kb-toast-countdown ${this.duration}ms linear forwards;${this._paused ? 'animation-play-state:paused' : 'animation-play-state:running'}"
        ></span>`
      : nothing;

    return html`
      <div
        data-kb-toast
        class=${classes}
        role="alert"
        aria-live="assertive"
        @mouseenter=${() => this._onMouseEnter()}
        @mouseleave=${() => this._onMouseLeave()}
      >
        <div class="flex items-start gap-3 px-4 py-3">
          ${this.showIcon
            ? html`<span class="flex-shrink-0 mt-0.5 ${iconColor}" aria-hidden="true">${STATUS_ICONS[this.status]}</span>`
            : nothing
          }
          <div class="flex-1 min-w-0 ${kbClasses.textPrimary}">
            ${titleEl
              ? html`<div class="font-semibold text-sm mb-0.5">${titleEl}</div>`
              : nothing
            }
            <div class="text-sm">${this.defaultSlotContent}</div>
            ${actionEl
              ? html`<div class="mt-2 flex items-center gap-2">${actionEl}</div>`
              : nothing
            }
          </div>
          ${this.closable
            ? html`<button
                class="flex-shrink-0 cursor-pointer p-1 opacity-50 hover:opacity-100 ${kbClasses.transition} bg-transparent border-none ${kbClasses.textPrimary}"
                @click=${() => this._dismiss()}
                aria-label="Dismiss notification"
              >${closeIcon}</button>`
            : nothing
          }
        </div>
        ${progressBar}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-toast': KbToast;
  }
}
