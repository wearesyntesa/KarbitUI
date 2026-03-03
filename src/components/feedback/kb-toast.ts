import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { dismissWithAnimation, KbBaseElement } from '../../core/base-element.js';
import { renderCloseIcon, STATUS_ICONS } from '../../core/icons.js';
import { kbClasses } from '../../core/theme.js';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

const STATUS_BORDER: Record<ToastStatus, string> = {
  info: 'border-l-blue-500',
  success: 'border-l-green-500',
  warning: 'border-l-yellow-500',
  error: 'border-l-red-500',
} as const satisfies Record<ToastStatus, string>;

const STATUS_ICON_COLOR: Record<ToastStatus, string> = {
  info: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
} as const satisfies Record<ToastStatus, string>;

const PROGRESS_COLOR: Record<ToastStatus, string> = {
  info: 'bg-blue-500 dark:bg-blue-400',
  success: 'bg-green-500 dark:bg-green-400',
  warning: 'bg-yellow-500 dark:bg-yellow-400',
  error: 'bg-red-500 dark:bg-red-400',
} as const satisfies Record<ToastStatus, string>;

const POSITION_CLASSES: Record<ToastPosition, string> = {
  top: 'fixed top-4 left-1/2 -translate-x-1/2',
  'top-right': 'fixed top-4 right-4',
  'top-left': 'fixed top-4 left-4',
  bottom: 'fixed bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'fixed bottom-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
} as const satisfies Record<ToastPosition, string>;

const ENTER_ANIMATION: Record<ToastPosition, string> = {
  top: 'animate-kb-slide-in-down',
  'top-right': 'animate-kb-slide-in-down',
  'top-left': 'animate-kb-slide-in-down',
  bottom: 'animate-kb-slide-in-up',
  'bottom-right': 'animate-kb-slide-in-up',
  'bottom-left': 'animate-kb-slide-in-up',
} as const satisfies Record<ToastPosition, string>;

const CLOSE_ICON: TemplateResult = renderCloseIcon('w-4 h-4', 2.5);

const isTopPosition = (pos: ToastPosition): boolean => pos === 'top' || pos === 'top-right' || pos === 'top-left';

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
export class KbToast extends KbBaseElement<'title' | 'action'> {
  static override hostDisplay = 'block' as const;

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

  /** Exclude `position` from style-props system - this component owns the `position` property directly. */
  protected override _excludedStyleProps: ReadonlySet<string> = new Set(['position']);

  @state() private _dismissing = false;
  @state() private _paused = false;

  private _timerId: ReturnType<typeof setTimeout> | undefined;
  private _startTime = 0;
  private _remaining = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    if (isServer) return;
    this._remaining = this.duration;
    this._startTimer();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (isServer) return;
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
    this.emit('kb-close');
    dismissWithAnimation(this, '[data-kb-toast]', 350);
  }

  override render(): TemplateResult {
    const posClasses = POSITION_CLASSES[this.position] ?? POSITION_CLASSES['top-right'];
    const statusBorder = STATUS_BORDER[this.status] ?? STATUS_BORDER.info;
    const enterAnim = ENTER_ANIMATION[this.position] ?? 'animate-kb-slide-in-down';
    const iconColor = STATUS_ICON_COLOR[this.status] ?? STATUS_ICON_COLOR.info;

    const exitTranslate = isTopPosition(this.position)
      ? '-translate-y-[calc(100%+1rem)]'
      : 'translate-y-[calc(100%+1rem)]';

    const dismissClasses = this._dismissing ? `opacity-0 ${exitTranslate}` : `opacity-100 ${enterAnim}`;

    const classes = this.buildClasses(
      `z-50 flex flex-col min-w-[300px] max-w-md ${kbClasses.border} border-l-4 ${kbClasses.surface} font-sans select-none overflow-hidden will-change-transform transition-[opacity,transform] duration-200 ease-in-out`,
      posClasses,
      statusBorder,
      dismissClasses,
    );

    const titleEl = this.slotted('title');
    const actionEl = this.slotted('action');

    const closeIcon = CLOSE_ICON;

    const progressBar =
      this.duration > 0
        ? html`<span
          class="block h-0.5 ${PROGRESS_COLOR[this.status] ?? PROGRESS_COLOR.info}"
          style="transform-origin:left;animation:kb-toast-countdown ${this.duration}ms linear forwards;${this._paused ? 'animation-play-state:paused' : 'animation-play-state:running'}"
        ></span>`
        : nothing;

    return html`
      <div
        data-kb-toast
        class=${classes}
        role="alert"
        @mouseenter=${this._onMouseEnter}
        @mouseleave=${this._onMouseLeave}
      >
        <div class="flex items-start gap-3 px-4 py-3">
          ${
            this.showIcon
              ? html`<span class="flex-shrink-0 mt-0.5 ${iconColor}" aria-hidden="true">${STATUS_ICONS[this.status]}</span>`
              : nothing
          }
          <div class="flex-1 min-w-0 ${kbClasses.textPrimary}">
            ${titleEl ? html`<div class="font-semibold text-sm mb-0.5">${titleEl}</div>` : nothing}
            <div class="text-sm">${this.defaultSlotContent}</div>
            ${actionEl ? html`<div class="mt-2 flex items-center gap-2">${actionEl}</div>` : nothing}
          </div>
          ${
            this.closable
              ? html`<button
                class="flex-shrink-0 cursor-pointer p-2 opacity-50 hover:opacity-100 ${kbClasses.transitionColors} bg-transparent border-none ${kbClasses.textPrimary}"
                @click=${this._dismiss}
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
