import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { SIZE_GAP, SIZE_PADDING, SIZE_TEXT, VARIANT_WRAPPER } from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type ClipboardVariant = 'outline' | 'subtle' | 'ghost';

const ICON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
} as const satisfies Record<ComponentSize, string>;

const BTN_SIZE: Record<ComponentSize, string> = {
  xs: 'h-6 px-1.5 text-xs gap-1',
  sm: 'h-7 px-2 text-xs gap-1',
  md: 'h-8 px-2.5 text-sm gap-1.5',
  lg: 'h-10 px-3 text-sm gap-2',
  xl: 'h-12 px-4 text-base gap-2',
} as const satisfies Record<ComponentSize, string>;

const BTN_VARIANT: Record<ClipboardVariant, string> = {
  outline: `${kbClasses.border} ${kbClasses.surface} hover:bg-gray-100 dark:hover:bg-zinc-800`,
  subtle: 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700',
  ghost: 'hover:bg-gray-100 dark:hover:bg-zinc-800',
} as const satisfies Record<ClipboardVariant, string>;

const COPIED_TEXT: string = 'text-green-600 dark:text-green-400';
const COPIED_BORDER: string = 'border-green-400 dark:border-green-500';

const INLINE_TRIGGER_BASE: string =
  'shrink-0 flex items-center justify-center cursor-pointer select-none border-l border-gray-300 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-800';

const INLINE_TRIGGER_SIZE: Record<ComponentSize, string> = {
  xs: 'px-1.5',
  sm: 'px-2',
  md: 'px-2.5',
  lg: 'px-3',
  xl: 'px-4',
} as const satisfies Record<ComponentSize, string>;

/**
 * Copy-to-clipboard component with visual feedback.
 *
 * Supports two display modes:
 * - **button** (default): Compact copy button with optional label.
 * - **inline** (`show-value`): Read-only input-like container displaying the
 *   value with a seamlessly attached copy trigger on the right.
 *
 * @fires kb-copy - Dispatched after a copy attempt with `{ value, success }`.
 *
 * @example
 * ```html
 * <kb-clipboard value="npm install karbit-ui"></kb-clipboard>
 * <kb-clipboard value="sk-1234-abcd" show-value></kb-clipboard>
 * <kb-clipboard value="https://karbit.dev" show-value label="URL"></kb-clipboard>
 * ```
 */
export class KbClipboard extends KbBaseElement {
  static override hostDisplay = 'inline-block' as const;

  /** The text value to copy to the clipboard. */
  @property({ type: String }) value: string = '';

  /** Optional label shown next to the icon (button mode) or above the value (inline mode). */
  @property({ type: String }) label: string = '';

  /** Label shown after a successful copy. @defaultValue 'Copied' */
  @property({ type: String, attribute: 'copied-label' }) copiedLabel: string = 'Copied';

  /** Display the value text inline with an integrated copy trigger. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-value' }) showValue: boolean = false;

  /** Component size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';

  /** Visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: ClipboardVariant = 'outline';

  /** Disables interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;

  /** Duration in ms to show the copied state. @defaultValue 1500 */
  @property({ type: Number }) timeout: number = 1500;

  @state() private _copied: boolean = false;

  private _timer: ReturnType<typeof setTimeout> | undefined;

  override disconnectedCallback(): void {
    clearTimeout(this._timer);
    super.disconnectedCallback();
  }

  private async _handleClick(): Promise<void> {
    if (this.disabled || this._copied) return;

    let success = true;
    try {
      await navigator.clipboard.writeText(this.value);
    } catch {
      /* clipboard write failed */
      success = false;
    }

    this._copied = true;
    this.emit('kb-copy', { value: this.value, success });

    clearTimeout(this._timer);
    this._timer = setTimeout((): void => {
      this._copied = false;
    }, this.timeout);
  }

  private _copyIcon(): TemplateResult {
    const s = ICON_SIZE[this.size];
    return html`<svg class="${s} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="9" y="9" width="13" height="13"/><path d="M5 15H4V4h11v1"/></svg>`;
  }

  private _checkIcon(): TemplateResult {
    const s = ICON_SIZE[this.size];
    return html`<svg class="${s} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`;
  }

  private _renderButton(): TemplateResult {
    const copiedColor = this._copied ? COPIED_TEXT : kbClasses.textPrimary;
    const copiedBorder = this._copied && this.variant === 'outline' ? COPIED_BORDER : '';

    const classes = this.buildClasses(
      'inline-flex items-center justify-center font-sans cursor-pointer select-none',
      kbClasses.transitionColors,
      BTN_SIZE[this.size],
      BTN_VARIANT[this.variant],
      copiedColor,
      copiedBorder,
      kbClasses.focus,
      this.disabled ? kbClasses.disabled : '',
    );

    const icon = this._copied ? this._checkIcon() : this._copyIcon();
    const displayLabel = this._copied ? this.copiedLabel : this.label;
    const labelEl = displayLabel ? html`<span class="leading-none">${displayLabel}</span>` : nothing;

    return html`
      <button
        class=${cx(classes)}
        ?disabled=${this.disabled}
        aria-label=${this.label || 'Copy to clipboard'}
        @click=${this._handleClick}
      >${icon}${labelEl}</button>
    `;
  }

  private _renderInline(): TemplateResult {
    const s = this.size;
    const copiedBorderOverride = this._copied
      ? 'border-green-400 dark:border-green-500 hover:border-green-400 dark:hover:border-green-500'
      : '';

    const outerClasses = this.buildClasses(
      'flex items-stretch w-full font-sans',
      kbClasses.transitionColors,
      copiedBorderOverride || VARIANT_WRAPPER.outline,
      this.disabled ? kbClasses.disabledLook : '',
    );

    const valueClasses = cx(
      'flex-1 min-w-0 truncate select-all flex items-center',
      SIZE_PADDING[s],
      SIZE_TEXT[s],
      this._copied ? COPIED_TEXT : kbClasses.textPrimary,
      kbClasses.transitionColors,
    );

    const triggerColor = this._copied ? COPIED_TEXT : kbClasses.textSecondary;
    const triggerBorder = this._copied ? 'border-green-400 dark:border-green-500' : '';
    const triggerClasses = cx(
      INLINE_TRIGGER_BASE,
      INLINE_TRIGGER_SIZE[s],
      triggerColor,
      triggerBorder,
      kbClasses.transitionColors,
      kbClasses.focus,
      this.disabled ? '' : 'active:bg-gray-200 dark:active:bg-zinc-700',
    );

    const icon = this._copied ? this._checkIcon() : this._copyIcon();
    const copiedStr = this._copied ? 'true' : 'false';

    const labelEl = this.label
      ? html`<span class=${cx('block', kbClasses.label, SIZE_GAP[s] === 'gap-1' ? 'mb-1' : 'mb-1.5')}>${this.label}</span>`
      : nothing;

    return html`
      ${labelEl}
      <div class=${outerClasses} role="group" aria-label=${this.label || 'Copy to clipboard'}>
        <span class=${valueClasses} aria-live="polite">${this.value}</span>
        <button
          class=${triggerClasses}
          ?disabled=${this.disabled}
          aria-label=${this._copied ? 'Copied' : 'Copy to clipboard'}
          aria-pressed=${copiedStr}
          @click=${this._handleClick}
        >${icon}</button>
      </div>
    `;
  }

  override render(): TemplateResult {
    return this.showValue ? this._renderInline() : this._renderButton();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-clipboard': KbClipboard;
  }
}
