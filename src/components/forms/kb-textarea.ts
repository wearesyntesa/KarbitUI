import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import {
  VARIANT_WRAPPER, VARIANT_WRAPPER_INVALID,
  SIZE_PADDING, SIZE_TEXT, CLEAR_SIZE, SPINNER_SIZE, FOCUS_RING,
  type FormVariant,
} from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import type { KbInputDetail, KbChangeValueDetail } from '../../core/events.js';

export type ResizeMode = 'vertical' | 'horizontal' | 'both' | 'none';

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
  /** Form textarea visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Textarea size controlling padding, font size, and action sizing. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Placeholder text shown when the textarea is empty. */
  @property({ type: String }) placeholder?: string;
  /** Current textarea value. Two-way bindable. @defaultValue '' */
  @property({ type: String }) value: string = '';
  /** Form field name, used in form submissions. */
  @property({ type: String }) name?: string;
  /** Initial visible row count. @defaultValue 4 */
  @property({ type: Number }) rows: number = 4;
  /** Maximum character count. Enables the character counter when set. */
  @property({ type: Number, attribute: 'max-length' }) maxLength?: number;
  /** CSS resize behavior. Overridden to `'none'` when `autoResize` is enabled. @defaultValue 'vertical' */
  @property({ type: String }) resize: ResizeMode = 'vertical';
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Mark the textarea as invalid with error border styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Make the textarea read-only (focusable but not editable). @defaultValue false */
  @property({ type: Boolean }) readonly: boolean = false;
  /** Mark the textarea as required for form validation. @defaultValue false */
  @property({ type: Boolean }) required: boolean = false;
  /** Show a clear button when the textarea has a value. @defaultValue false */
  @property({ type: Boolean }) clearable: boolean = false;
  /** Show a loading spinner in the action area. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;
  /** Automatically grow the textarea height to fit content. Disables manual resizing. @defaultValue false */
  @property({ type: Boolean, attribute: 'auto-resize' }) autoResize: boolean = false;

  private _handleInput(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;

    if (this.autoResize) {
      this._adjustHeight(target);
    }

    this.dispatchEvent(new CustomEvent<KbInputDetail>('kb-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent<KbChangeValueDetail>('kb-change', {
      detail: { source: 'textarea', value: this.value },
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
    this.dispatchEvent(new CustomEvent<KbInputDetail>('kb-input', {
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

    const focusRing = isFlushed ? '' : FOCUS_RING;

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
