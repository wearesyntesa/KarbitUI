import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

type SelectVariant = 'outline' | 'filled' | 'flushed';

interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

interface SelectOptionGroup {
  readonly group: string;
  readonly options: readonly SelectOption[];
}

type SelectOptionOrGroup = SelectOption | SelectOptionGroup;

function isOptionGroup(opt: SelectOptionOrGroup): opt is SelectOptionGroup {
  return 'group' in opt && 'options' in opt;
}

/** Wrapper border/bg per variant — mirrors kb-input exactly. */
const VARIANT_WRAPPER: Record<SelectVariant, string> = {
  outline: 'bg-white border border-gray-200 dark:border-zinc-700 dark:bg-transparent hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:hover:border-blue-500 dark:focus-within:hover:border-blue-400',
  filled: 'bg-gray-100 border border-gray-100 hover:bg-gray-200/60 dark:bg-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-700 focus-within:bg-white focus-within:border-gray-300 dark:focus-within:bg-transparent dark:focus-within:border-zinc-600',
  flushed: 'bg-transparent border-b border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:border-blue-500 dark:focus-within:border-blue-400',
};

const VARIANT_WRAPPER_INVALID: Record<SelectVariant, string> = {
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

const CHEVRON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
  xl: 'w-5 h-5',
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
 * Styled select dropdown with wrapper pattern, icon slot, animated chevron, clearable, loading, and option group support.
 *
 * @slot icon - Leading icon element inside the select wrapper.
 *
 * @fires kb-change - Value changed. Detail: `{ value: string }`.
 * @fires kb-focus - Select focused.
 * @fires kb-blur - Select blurred.
 * @fires kb-clear - Clear button clicked (when clearable).
 *
 * @example
 * ```html
 * <kb-select
 *   placeholder="Choose..."
 *   clearable
 *   .options=${[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
 * >
 *   <span slot="icon"><svg>...</svg></span>
 * </kb-select>
 * ```
 */
@customElement('kb-select')
export class KbSelect extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) variant: SelectVariant = 'outline';
  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: String }) placeholder?: string;
  @property({ type: String }) value: string = '';
  @property({ type: String }) name?: string;
  @property({ type: Array }) options: readonly SelectOptionOrGroup[] = [];
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) clearable: boolean = false;
  @property({ type: Boolean }) loading: boolean = false;

  @state() private _focused: boolean = false;

  private _handleChange(e: Event): void {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('kb-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleFocus(): void {
    this._focused = true;
    this.dispatchEvent(new CustomEvent('kb-focus', { bubbles: true, composed: true }));
  }

  private _handleBlur(): void {
    this._focused = false;
    this.dispatchEvent(new CustomEvent('kb-blur', { bubbles: true, composed: true }));
  }

  private _handleClear(): void {
    this.value = '';
    this.dispatchEvent(new CustomEvent('kb-change', {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    }));
    this.dispatchEvent(new CustomEvent('kb-clear', { bubbles: true, composed: true }));
    const select = this.renderRoot.querySelector('select');
    if (select) {
      select.value = '';
      select.focus();
    }
  }

  private _renderOptions() {
    const items: unknown[] = [];
    for (const opt of this.options) {
      if (isOptionGroup(opt)) {
        items.push(html`
          <optgroup label=${opt.group}>
            ${opt.options.map(o => html`<option value=${o.value} ?disabled=${o.disabled ?? false} ?selected=${o.value === this.value}>${o.label}</option>`)}
          </optgroup>
        `);
      } else {
        items.push(html`<option value=${opt.value} ?disabled=${opt.disabled ?? false} ?selected=${opt.value === this.value}>${opt.label}</option>`);
      }
    }
    return items;
  }

  override render() {
    const isFlushed = this.variant === 'flushed';
    const iconSlot = this.slotted('icon');

    const hasValue = this.value !== '';
    const showClear = this.clearable && hasValue && !this.disabled;
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
      'flex items-center flex-1 relative',
      SIZE_PADDING[this.size],
      SIZE_GAP[this.size],
      isFlushed ? wrapperBorder : '',
    ].filter(Boolean).join(' ');

    const selectClasses = [
      'flex-1 min-w-0 bg-transparent outline-none border-none appearance-none cursor-pointer',
      SIZE_TEXT[this.size],
      kbClasses.textPrimary,
      this.disabled ? 'cursor-not-allowed' : '',
      // Reserve right padding for chevron/clear/loading
      showClear && !showLoading ? 'pr-6' : showLoading ? 'pr-6' : 'pr-5',
    ].filter(Boolean).join(' ');

    const iconClasses = `shrink-0 flex items-center ${kbClasses.textMuted} ${SIZE_ICON[this.size]}`;

    const focusRing = isFlushed
      ? ''
      : 'focus-within:outline-2 focus-within:outline-blue-500 focus-within:outline-offset-2';

    const iconEl = iconSlot
      ? html`<span class="${iconClasses}">${iconSlot}</span>`
      : nothing;

    const chevronRotate = this._focused ? 'rotate-180' : 'rotate-0';
    const chevronEl = !showLoading
      ? html`<span class="shrink-0 flex items-center pointer-events-none ${kbClasses.textMuted} transition-transform duration-200 ${chevronRotate}">
          <svg class="${CHEVRON_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>
        </span>`
      : nothing;

    const clearEl = showClear
      ? html`<button
          class="shrink-0 flex items-center cursor-pointer bg-transparent border-none p-0 ${kbClasses.textMuted} hover:text-slate-700 dark:hover:text-zinc-200 ${kbClasses.transition}"
          @click=${(e: Event) => { e.stopPropagation(); this._handleClear(); }}
          type="button"
          aria-label="Clear selection"
          tabindex="-1"
        ><svg class="${CLEAR_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`
      : nothing;

    const loadingEl = showLoading
      ? html`<span class="shrink-0 flex items-center"><span class="${SPINNER_SIZE[this.size]} rounded-full border-current border-t-transparent animate-spin" style="border-style:solid"></span></span>`
      : nothing;

    // Placeholder color when no value selected
    const placeholderStyle = !hasValue ? 'color: var(--kb-select-placeholder, #94a3b8)' : '';

    return html`
      <div class="${outerClasses} ${focusRing}">
        <div class=${innerClasses}>
          ${iconEl}
          <select
            class=${selectClasses}
            .value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-invalid=${this.invalid ? 'true' : 'false'}
            name=${this.name ?? ''}
            style=${placeholderStyle}
            @change=${this._handleChange}
            @focus=${() => this._handleFocus()}
            @blur=${() => this._handleBlur()}
          >
            ${this.placeholder
              ? html`<option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>`
              : nothing
            }
            ${this._renderOptions()}
          </select>
          ${clearEl}
          ${loadingEl}
          ${chevronEl}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-select': KbSelect;
  }
}
