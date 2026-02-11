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
  SIZE_GAP,
  SIZE_ICON,
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

export type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | (string & {});

/**
 * Text input with icon/addon slots, clearable, loading state, and focus accent.
 *
 * @slot icon-left - Leading icon element inside the input.
 * @slot icon-right - Trailing icon element inside the input.
 * @slot addon-left - Attached text/element flush to the left edge (e.g. "https://").
 * @slot addon-right - Attached text/element flush to the right edge (e.g. ".com").
 *
 * @fires kb-input - Value changed on input. Detail: `{ value: string }`.
 * @fires kb-change - Value committed on change. Detail: `{ value: string }`.
 * @fires kb-focus - Input focused.
 * @fires kb-blur - Input blurred.
 * @fires kb-clear - Clear button clicked (when clearable).
 *
 * @example
 * ```html
 * <kb-input placeholder="Search..." clearable>
 *   <span slot="icon-left"><svg>...</svg></span>
 * </kb-input>
 * ```
 */
@customElement('kb-input')
export class KbInput extends KbBaseElement<'addon-left' | 'addon-right' | 'icon-left' | 'icon-right'> {
  /** Form input visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Input size controlling padding, font size, and icon sizing. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Placeholder text shown when the input is empty. */
  @property({ type: String }) placeholder?: string;
  /** Current input value. Two-way bindable. @defaultValue '' */
  @property({ type: String }) value: string = '';
  /** HTML input type attribute (e.g. `'text'`, `'password'`, `'email'`). @defaultValue 'text' */
  @property({ type: String }) type: InputType = 'text';
  /** Form field name, used in form submissions. */
  @property({ type: String }) name?: string;
  /** Maximum character count. When set, enforces length via the native `maxlength` attribute. */
  @property({ type: Number, attribute: 'max-length' }) maxLength?: number;
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Mark the input as invalid with error border styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Make the input read-only (focusable but not editable). @defaultValue false */
  @property({ type: Boolean }) readonly: boolean = false;
  /** Mark the input as required for form validation. @defaultValue false */
  @property({ type: Boolean }) required: boolean = false;
  /** Show a clear button when the input has a value. @defaultValue false */
  @property({ type: Boolean }) clearable: boolean = false;
  /** Show a loading spinner in place of the trailing icon. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;

  private _handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.emit('kb-input', { value: this.value });
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.emit('kb-change', { source: 'input', value: this.value });
  }

  private _handleFocus(): void {
    this.emit('kb-focus');
  }

  private _handleBlur(): void {
    this.emit('kb-blur');
  }

  private _handleClear(): void {
    this.value = '';
    this.emit('kb-input', { value: '' });
    this.emit('kb-change', { source: 'input', value: '' });
    this.emit('kb-clear');
    const input = this.renderRoot.querySelector('input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  override render(): TemplateResult {
    const isFlushed = this.variant === 'flushed';
    const addonLeft = this.slotted('addon-left');
    const addonRight = this.slotted('addon-right');
    const iconLeft = this.slotted('icon-left');
    const iconRight = this.slotted('icon-right');

    const showClear = this.clearable && this.value.length > 0 && !this.disabled && !this.readonly;
    const showLoading = this.loading && !this.disabled;

    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];

    const outerClasses = this.buildClasses(
      'flex items-stretch w-full font-sans',
      kbClasses.transition,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
    );

    const innerClasses = cx(
      'flex items-center flex-1',
      SIZE_PADDING[this.size],
      SIZE_GAP[this.size],
      isFlushed ? wrapperBorder : '',
    );

    const inputClasses = cx(FORM_INPUT_BASE, SIZE_TEXT[this.size], kbClasses.textPrimary, FORM_PLACEHOLDER);

    const iconClasses = cx('shrink-0 flex items-center', kbClasses.textMuted, SIZE_ICON[this.size]);

    const addonClasses = cx(
      'flex items-center shrink-0',
      SIZE_PADDING[this.size],
      SIZE_TEXT[this.size],
      kbClasses.surfaceMuted,
      kbClasses.textSecondary,
      'select-none',
    );

    const addonLeftEl = addonLeft
      ? html`<span class="${addonClasses} border-r ${kbClasses.borderColor}">${addonLeft}</span>`
      : nothing;

    const addonRightEl = addonRight
      ? html`<span class="${addonClasses} border-l ${kbClasses.borderColor}">${addonRight}</span>`
      : nothing;

    const iconLeftEl = iconLeft ? html`<span class="${iconClasses}">${iconLeft}</span>` : nothing;

    const iconRightEl = !showLoading && iconRight ? html`<span class="${iconClasses}">${iconRight}</span>` : nothing;

    const clearEl = showClear
      ? html`<button
          class="${FORM_CLEAR_CLASSES}"
          @click=${this._handleClear}
          type="button"
          aria-label="Clear input"
          tabindex="-1"
        >${renderCloseIcon(CLEAR_SIZE[this.size])}</button>`
      : nothing;

    const loadingEl = showLoading ? renderFormSpinner(SPINNER_SIZE[this.size]) : nothing;

    const focusRing = isFlushed ? '' : FOCUS_RING;

    return html`
      <div class="${outerClasses} ${focusRing}">
        ${addonLeftEl}
        <div class=${innerClasses}>
          ${iconLeftEl}
          <input
            class=${inputClasses}
            type=${this.type}
            .value=${this.value}
            placeholder=${this.placeholder ?? ''}
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
          />
          ${clearEl}
          ${loadingEl}
          ${iconRightEl}
        </div>
        ${addonRightEl}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-input': KbInput;
  }
}
