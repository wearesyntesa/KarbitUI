import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { KbInputDetail, KbChangeValueDetail } from '../../core/events.js';
import {
  VARIANT_WRAPPER, VARIANT_WRAPPER_INVALID,
  SIZE_PADDING, SIZE_TEXT, SIZE_ICON, SIZE_GAP, CLEAR_SIZE, SPINNER_SIZE, FOCUS_RING,
  type FormVariant,
} from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

export type InputType =
  | 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
  | 'search' | 'date' | 'time' | 'datetime-local'
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
export class KbInput extends KbBaseElement {
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
    this.dispatchEvent(new CustomEvent<KbInputDetail>('kb-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent<KbChangeValueDetail>('kb-change', {
      detail: { source: 'input', value: this.value },
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
    this.dispatchEvent(new CustomEvent<KbInputDetail>('kb-input', {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('kb-clear', { bubbles: true, composed: true }));
    const input = this.renderRoot.querySelector('input');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  override render() {
    const isFlushed = this.variant === 'flushed';
    const addonLeft = this.slotted('addon-left');
    const addonRight = this.slotted('addon-right');
    const iconLeft = this.slotted('icon-left');
    const iconRight = this.slotted('icon-right');

    const showClear = this.clearable && this.value.length > 0 && !this.disabled && !this.readonly;
    const showLoading = this.loading && !this.disabled;

    const wrapperBorder = this.invalid
      ? VARIANT_WRAPPER_INVALID[this.variant]
      : VARIANT_WRAPPER[this.variant];

    const outerClasses = this.buildClasses(
      'flex items-stretch w-full font-sans',
      kbClasses.transition,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
    );

    const innerClasses = [
      'flex items-center flex-1',
      SIZE_PADDING[this.size],
      SIZE_GAP[this.size],
      isFlushed ? wrapperBorder : '',
    ].filter(Boolean).join(' ');

    const inputClasses = [
      'flex-1 min-w-0 bg-transparent outline-none border-none',
      SIZE_TEXT[this.size],
      kbClasses.textPrimary,
      'placeholder:text-slate-400 dark:placeholder:text-zinc-500',
    ].join(' ');

    const iconClasses = `shrink-0 flex items-center ${kbClasses.textMuted} ${SIZE_ICON[this.size]}`;

    const addonClasses = [
      'flex items-center shrink-0',
      SIZE_PADDING[this.size],
      SIZE_TEXT[this.size],
      'bg-gray-50 dark:bg-zinc-800',
      kbClasses.textSecondary,
      'select-none',
    ].join(' ');

    const addonLeftEl = addonLeft
      ? html`<span class="${addonClasses} border-r border-gray-200 dark:border-zinc-700">${addonLeft}</span>`
      : nothing;

    const addonRightEl = addonRight
      ? html`<span class="${addonClasses} border-l border-gray-200 dark:border-zinc-700">${addonRight}</span>`
      : nothing;

    const iconLeftEl = iconLeft
      ? html`<span class="${iconClasses}">${iconLeft}</span>`
      : nothing;

    const iconRightEl = !showLoading && iconRight
      ? html`<span class="${iconClasses}">${iconRight}</span>`
      : nothing;

    const clearEl = showClear
      ? html`<button
          class="shrink-0 flex items-center cursor-pointer bg-transparent border-none p-0 ${kbClasses.textMuted} hover:text-slate-700 dark:hover:text-zinc-200 ${kbClasses.transition}"
          @click=${() => this._handleClear()}
          type="button"
          aria-label="Clear input"
          tabindex="-1"
        ><svg class="${CLEAR_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`
      : nothing;

    const loadingEl = showLoading
      ? html`<span class="shrink-0 flex items-center"><span class="${SPINNER_SIZE[this.size]} rounded-full border-current border-t-transparent animate-spin" style="border-style:solid"></span></span>`
      : nothing;

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
            @focus=${() => this._handleFocus()}
            @blur=${() => this._handleBlur()}
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
