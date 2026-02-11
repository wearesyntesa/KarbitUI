import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import {
  CLEAR_SIZE,
  FOCUS_RING,
  FORM_CLEAR_CLASSES,
  FORM_INPUT_BASE,
  FORM_PLACEHOLDER,
  type FormVariant,
  renderFormSpinner,
  SIZE_PADDING,
  SIZE_TEXT,
  SPINNER_SIZE,
  VARIANT_WRAPPER,
  VARIANT_WRAPPER_INVALID,
} from '../../core/form-tokens.js';
import { renderCloseIcon } from '../../core/icons.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type ResizeMode = 'vertical' | 'horizontal' | 'both' | 'none';

const COUNTER_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-sm',
} as const satisfies Record<ComponentSize, string>;

const RESIZE_MAP: Record<ResizeMode, string> = {
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
  none: 'resize-none',
} as const satisfies Record<ResizeMode, string>;

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

    this.emit('kb-input', { value: this.value });
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this.emit('kb-change', { source: 'textarea', value: this.value });
  }

  private _handleFocus(): void {
    this.emit('kb-focus');
  }

  private _handleBlur(): void {
    this.emit('kb-blur');
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
    this.emit('kb-input', { value: '' });
    this.emit('kb-change', { source: 'textarea', value: '' });
    this.emit('kb-clear');
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

  override render(): TemplateResult {
    const isFlushed = this.variant === 'flushed';

    const showClear = this.clearable && this.value.length > 0 && !this.disabled && !this.readonly;
    const showLoading = this.loading && !this.disabled;
    const showCounter = this.maxLength !== undefined;

    const charCount = this.value.length;
    const charLimit = this.maxLength ?? 0;
    const charRatio = charLimit > 0 ? charCount / charLimit : 0;

    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];

    const outerClasses = this.buildClasses(
      'flex flex-col w-full font-sans relative',
      kbClasses.transition,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
    );

    const resizeClass = this.autoResize ? 'resize-none' : RESIZE_MAP[this.resize];

    const textareaClasses = cx(
      FORM_INPUT_BASE,
      SIZE_PADDING[this.size],
      SIZE_TEXT[this.size],
      kbClasses.textPrimary,
      FORM_PLACEHOLDER,
      resizeClass,
      this.autoResize ? 'overflow-hidden' : '',
      isFlushed ? wrapperBorder : '',
    );

    const focusRing = isFlushed ? '' : FOCUS_RING;

    // Top-right action buttons (clear / loading)
    const hasActions = showClear || showLoading;
    const actionsEl = hasActions
      ? html`<div class="absolute top-0 right-0 flex items-center gap-1 ${SIZE_PADDING[this.size]} pointer-events-none">
          ${
            showClear
              ? html`<button
                class="pointer-events-auto ${FORM_CLEAR_CLASSES}"
                @click=${this._handleClear}
                type="button"
                aria-label="Clear textarea"
                tabindex="-1"
              >${renderCloseIcon(CLEAR_SIZE[this.size])}</button>`
              : nothing
          }
          ${
            showLoading
              ? renderFormSpinner(SPINNER_SIZE[this.size], `pointer-events-auto ${kbClasses.textMuted}`)
              : nothing
          }
        </div>`
      : nothing;

    // Bottom counter bar
    let counterColor: string;
    if (charRatio >= 1) counterColor = 'text-red-500 dark:text-red-400';
    else if (charRatio >= 0.8) counterColor = 'text-yellow-600 dark:text-yellow-400';
    else counterColor = kbClasses.textMuted;

    const counterEl = showCounter
      ? html`<div class="flex justify-end ${SIZE_PADDING[this.size]} pt-0">
          <span class="${COUNTER_TEXT[this.size]} font-mono tabular-nums ${counterColor}">${charCount} / ${charLimit}</span>
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
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
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
