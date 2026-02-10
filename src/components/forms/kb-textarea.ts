import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

type TextareaVariant = 'outline' | 'filled' | 'flushed';
type ResizeMode = 'vertical' | 'horizontal' | 'both' | 'none';

/** Wrapper border/bg per variant — mirrors kb-input/kb-select. */
const VARIANT_WRAPPER: Record<TextareaVariant, string> = {
  outline: 'bg-white border border-gray-200 dark:border-zinc-700 dark:bg-transparent hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:hover:border-blue-500 dark:focus-within:hover:border-blue-400',
  filled: 'bg-gray-100 border border-gray-100 hover:bg-gray-200/60 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-700 focus-within:bg-white focus-within:border-gray-300 dark:focus-within:bg-transparent dark:focus-within:border-zinc-600',
  flushed: 'bg-transparent border-b border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400',
};

const VARIANT_WRAPPER_INVALID: Record<TextareaVariant, string> = {
  outline: 'border-red-500 dark:border-red-500 hover:border-red-500 dark:hover:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
  filled: 'border-red-500 dark:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
  flushed: 'border-red-500 dark:border-red-500 hover:border-red-500 dark:hover:border-red-500 focus-within:border-red-500 dark:focus-within:border-red-500',
};

const SIZE_PADDING: Record<ComponentSize, string> = {
  xs: 'px-2 py-1',
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
  xl: 'px-6 py-4',
};

const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

const CLEAR_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
  xl: 'w-5 h-5',
};

const SPINNER_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-3.5 h-3.5 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-4.5 h-4.5 border-2',
  xl: 'w-5 h-5 border-2',
};

const COUNTER_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-sm',
};

const RESIZE_MAP: Record<ResizeMode, string> = {
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
  none: 'resize-none',
};

/**
 * Multi-line text input with wrapper pattern, auto-resize, clearable, loading,
 * character counter, and focus accent.
 *
 * @fires kb-input - Value changed on input. Detail: `{ value: string }`.
 * @fires kb-change - Value committed on change. Detail: `{ value: string }`.
 * @fires kb-focus - Textarea focused.
 * @fires kb-blur - Textarea blurred.
 * @fires kb-clear - Clear button clicked (when clearable).
 *
 * @example
 * ```html
 * <kb-textarea placeholder="Write something..." auto-resize clearable max-length="500"></kb-textarea>
 * ```
 */
@customElement('kb-textarea')
export class KbTextarea extends KbBaseElement {
  @property({ type: String }) variant: TextareaVariant = 'outline';
  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: String }) placeholder?: string;
  @property({ type: String }) value: string = '';
  @property({ type: String }) name?: string;
  @property({ type: Number }) rows: number = 4;
  @property({ type: Number, attribute: 'max-length' }) maxLength?: number;
  @property({ type: String }) resize: ResizeMode = 'vertical';
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: Boolean }) readonly: boolean = false;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) clearable: boolean = false;
  @property({ type: Boolean }) loading: boolean = false;
  @property({ type: Boolean, attribute: 'auto-resize' }) autoResize: boolean = false;

  private _handleInput(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;

    if (this.autoResize) {
      this._adjustHeight(target);
    }

    this.dispatchEvent(new CustomEvent('kb-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('kb-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleFocus(): void {
    this.dispatchEvent(new CustomEvent('kb-focus', { bubbles: true, composed: true }));
  }

  private _handleBlur(): void {
    this.dispatchEvent(new CustomEvent('kb-blur', { bubbles: true, composed: true }));
  }

  private _handleClear(): void {
    this.value = '';
    const textarea = this.renderRoot.querySelector('textarea');
    if (textarea) {
      textarea.value = '';
      if (this.autoResize) {
        textarea.style.height = 'auto';
      }
      textarea.focus();
    }
    this.dispatchEvent(new CustomEvent('kb-input', {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('kb-clear', { bubbles: true, composed: true }));
  }

  private _adjustHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  override updated(changedProperties: Map<PropertyKey, unknown>): void {
    super.updated(changedProperties);
    if (this.autoResize && (changedProperties.has('value') || changedProperties.has('autoResize'))) {
      const textarea = this.renderRoot.querySelector('textarea');
      if (textarea) {
        this._adjustHeight(textarea);
      }
    }
  }

  override render() {
    const isFlushed = this.variant === 'flushed';

    const showClear = this.clearable && this.value.length > 0 && !this.disabled && !this.readonly;
    const showLoading = this.loading && !this.disabled;
    const showCounter = this.maxLength !== undefined;

    const charCount = this.value.length;
    const charLimit = this.maxLength ?? 0;
    const charRatio = charLimit > 0 ? charCount / charLimit : 0;

    const wrapperBorder = this.invalid
      ? VARIANT_WRAPPER_INVALID[this.variant]
      : VARIANT_WRAPPER[this.variant];

    const outerClasses = this.buildClasses(
      'flex flex-col w-full font-sans relative',
      kbClasses.transition,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
    );

    const resizeClass = this.autoResize ? 'resize-none' : RESIZE_MAP[this.resize];

    const textareaClasses = [
      'flex-1 min-w-0 bg-transparent outline-none border-none',
      SIZE_PADDING[this.size],
      SIZE_TEXT[this.size],
      kbClasses.textPrimary,
      'placeholder:text-slate-400 dark:placeholder:text-zinc-500',
      resizeClass,
      this.autoResize ? 'overflow-hidden' : '',
      isFlushed ? wrapperBorder : '',
    ].filter(Boolean).join(' ');

    const focusRing = isFlushed
      ? ''
      : 'focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2';

    // Top-right action buttons (clear / loading)
    const hasActions = showClear || showLoading;
    const actionsEl = hasActions
      ? html`<div class="absolute top-0 right-0 flex items-center gap-1 ${SIZE_PADDING[this.size]} pointer-events-none">
          ${showClear
            ? html`<button
                class="pointer-events-auto shrink-0 flex items-center cursor-pointer bg-transparent border-none p-0 ${kbClasses.textMuted} hover:text-slate-700 dark:hover:text-zinc-200 ${kbClasses.transition}"
                @click=${() => this._handleClear()}
                type="button"
                aria-label="Clear textarea"
                tabindex="-1"
              ><svg class="${CLEAR_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`
            : nothing}
          ${showLoading
            ? html`<span class="pointer-events-auto shrink-0 flex items-center"><span class="${SPINNER_SIZE[this.size]} rounded-full border-current border-t-transparent animate-spin ${kbClasses.textMuted}" style="border-style:solid"></span></span>`
            : nothing}
        </div>`
      : nothing;

    // Bottom counter bar
    const counterEl = showCounter
      ? html`<div class="flex justify-end ${SIZE_PADDING[this.size]} pt-0">
          <span class="${COUNTER_TEXT[this.size]} font-mono tabular-nums ${
            charRatio >= 1 ? 'text-red-500 dark:text-red-400'
            : charRatio >= 0.8 ? 'text-yellow-600 dark:text-yellow-400'
            : kbClasses.textMuted
          }">${charCount} / ${charLimit}</span>
        </div>`
      : nothing;

    return html`
      <div class="${outerClasses} ${focusRing}">
        <textarea
          class=${textareaClasses}
          .value=${this.value}
          placeholder=${this.placeholder ?? ''}
          rows=${this.rows}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          name=${this.name ?? ''}
          maxlength=${this.maxLength ?? nothing}
          @input=${this._handleInput}
          @change=${this._handleChange}
          @focus=${() => this._handleFocus()}
          @blur=${() => this._handleBlur()}
        ></textarea>
        ${actionsEl}
        ${counterEl}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-textarea': KbTextarea;
  }
}
