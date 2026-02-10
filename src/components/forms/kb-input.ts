import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

type InputVariant = 'outline' | 'filled' | 'flushed';

/** Wrapper border/bg classes per variant. Focus handled via focus-within on wrapper. */
const VARIANT_WRAPPER: Record<InputVariant, string> = {
  outline: `bg-white border border-gray-200 dark:border-zinc-700 dark:bg-transparent hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:hover:border-blue-500 dark:focus-within:hover:border-blue-400`,
  filled: `bg-gray-100 border border-gray-100 hover:bg-gray-200/60 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-700 focus-within:bg-white focus-within:border-gray-300 dark:focus-within:bg-transparent dark:focus-within:border-zinc-600`,
  flushed: `bg-transparent border-b border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400`,
};

const VARIANT_WRAPPER_INVALID: Record<InputVariant, string> = {
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

const SIZE_ICON: Record<ComponentSize, string> = {
  xs: '[&>svg]:w-3 [&>svg]:h-3',
  sm: '[&>svg]:w-4 [&>svg]:h-4',
  md: '[&>svg]:w-4.5 [&>svg]:h-4.5',
  lg: '[&>svg]:w-5 [&>svg]:h-5',
  xl: '[&>svg]:w-6 [&>svg]:h-6',
};

const SIZE_GAP: Record<ComponentSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
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
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) variant: InputVariant = 'outline';
  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: String }) placeholder?: string;
  @property({ type: String }) value: string = '';
  @property({ type: String }) type: string = 'text';
  @property({ type: String }) name?: string;
  @property({ type: Number, attribute: 'max-length' }) maxLength?: number;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: Boolean }) readonly: boolean = false;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) clearable: boolean = false;
  @property({ type: Boolean }) loading: boolean = false;

  private _handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('kb-input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
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
    this.dispatchEvent(new CustomEvent('kb-input', {
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

    const focusRing = isFlushed
      ? ''
      : 'focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2';

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
