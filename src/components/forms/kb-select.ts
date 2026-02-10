import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import {
  VARIANT_WRAPPER, VARIANT_WRAPPER_INVALID,
  SIZE_PADDING, SIZE_TEXT, SIZE_ICON, SIZE_GAP, CLEAR_SIZE, SPINNER_SIZE, FOCUS_RING,
  type FormVariant,
} from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import type { KbChangeValueDetail } from '../../core/events.js';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface SelectOptionGroup {
  readonly group: string;
  readonly options: readonly SelectOption[];
}

export type SelectOptionOrGroup = SelectOption | SelectOptionGroup;

function isOptionGroup(opt: SelectOptionOrGroup): opt is SelectOptionGroup {
  return 'group' in opt && 'options' in opt;
}

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
  /** Form select visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Select size controlling padding, font size, and icon sizing. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Placeholder text shown as a disabled option when no value is selected. */
  @property({ type: String }) placeholder?: string;
  /** Currently selected value. @defaultValue '' */
  @property({ type: String }) value: string = '';
  /** Form field name, used in form submissions. */
  @property({ type: String }) name?: string;
  /** Array of options or option groups to render in the dropdown. */
  @property({ type: Array }) options: readonly SelectOptionOrGroup[] = [];
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Mark the select as invalid with error border styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Mark the select as required for form validation. @defaultValue false */
  @property({ type: Boolean }) required: boolean = false;
  /** Show a clear button when a value is selected. @defaultValue false */
  @property({ type: Boolean }) clearable: boolean = false;
  /** Show a loading spinner in place of the chevron. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;

  @state() private _focused: boolean = false;

  private _handleChange(e: Event): void {
    const target = e.target as HTMLSelectElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent<KbChangeValueDetail>('kb-change', {
      detail: { source: 'select', value: this.value },
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
    this.dispatchEvent(new CustomEvent<KbChangeValueDetail>('kb-change', {
      detail: { source: 'select', value: '' },
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
    const items: TemplateResult[] = [];
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

    const focusRing = isFlushed ? '' : FOCUS_RING;

    const iconEl = iconSlot
      ? html`<span class="${iconClasses}">${iconSlot}</span>`
      : nothing;

    const chevronRotate = this._focused ? 'rotate-180' : 'rotate-0';
    const chevronEl = !showLoading
      ? html`<span class="shrink-0 flex items-center pointer-events-none ${kbClasses.textMuted} transition-transform duration-200 ${chevronRotate}">
           <svg class="${CLEAR_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>
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
