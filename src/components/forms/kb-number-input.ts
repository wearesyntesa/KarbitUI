import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import {
  FORM_DISABLED_CONTROL,
  FORM_INPUT_BASE,
  FORM_PLACEHOLDER,
  type FormVariant,
  SIZE_TEXT,
  VARIANT_WRAPPER,
  VARIANT_WRAPPER_INVALID,
} from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const BUTTON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-9 h-9',
  xl: 'w-10 h-10',
} as const satisfies Record<ComponentSize, string>;

const ICON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
  xl: 'w-5 h-5',
} as const satisfies Record<ComponentSize, string>;

/**
 * Numeric input with increment/decrement stepper buttons.
 *
 * @fires kb-change - Value committed. Detail: `{ source: 'number-input', value: string }`.
 * @fires kb-input - Value changed during input. Detail: `{ value: string }`.
 *
 * @example
 * ```html
 * <kb-number-input value="5" min="0" max="100" step="1"></kb-number-input>
 * ```
 */
export class KbNumberInput extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Current numeric value. @defaultValue 0 */
  @property({ type: Number }) value: number = 0;
  /** Minimum allowed value. */
  @property({ type: Number }) min?: number;
  /** Maximum allowed value. */
  @property({ type: Number }) max?: number;
  /** Step increment for stepper buttons and arrow keys. @defaultValue 1 */
  @property({ type: Number }) step: number = 1;
  /** Input size controlling padding and font size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Form input visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error border styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Form field name. */
  @property({ type: String }) name?: string;

  private _clamp(val: number): number {
    let clamped: number = val;
    if (this.min !== undefined && clamped < this.min) clamped = this.min;
    if (this.max !== undefined && clamped > this.max) clamped = this.max;
    return clamped;
  }

  private _setValue(val: number): void {
    const clamped = this._clamp(val);
    if (clamped === this.value) return;
    this.value = clamped;
    this.emit('kb-input', { value: String(this.value) });
    this.emit('kb-change', { source: 'number-input', value: String(this.value) });
  }

  private _increment(): void {
    if (this.disabled) return;
    this._setValue(this.value + this.step);
  }

  private _decrement(): void {
    if (this.disabled) return;
    this._setValue(this.value - this.step);
  }

  private _handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const parsed = Number.parseFloat(target.value);
    if (!Number.isNaN(parsed)) {
      this.value = parsed;
      this.emit('kb-input', { value: String(this.value) });
    }
  }

  private _handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const parsed = Number.parseFloat(target.value);
    if (Number.isNaN(parsed)) {
      target.value = String(this.value);
      return;
    }
    this._setValue(parsed);
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._decrement();
    }
  }

  private _isAtMin(): boolean {
    return this.min !== undefined && this.value <= this.min;
  }

  private _isAtMax(): boolean {
    return this.max !== undefined && this.value >= this.max;
  }

  override render(): TemplateResult {
    const s = this.size;
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];

    const outerClasses = this.buildClasses(
      'flex items-center w-full font-sans',
      kbClasses.transitionColors,
      wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const inputClasses: string = cx(
      FORM_INPUT_BASE,
      SIZE_TEXT[s],
      kbClasses.textPrimary,
      FORM_PLACEHOLDER,
      'text-center tabular-nums',
    );

    const btnBase: string = cx(
      'flex items-center justify-center shrink-0 select-none',
      'border-none bg-transparent cursor-pointer',
      kbClasses.textSecondary,
      'hover:text-slate-900 dark:hover:text-zinc-50',
      kbClasses.transitionColors,
      BUTTON_SIZE[s],
    );

    const decrementDisabled = this.disabled || this._isAtMin();
    const incrementDisabled = this.disabled || this._isAtMax();

    return html`
      <div class=${outerClasses}>
        <button
          class=${cx(btnBase, `border-r ${kbClasses.borderColor}`, decrementDisabled ? 'opacity-30 pointer-events-none' : '')}
          @click=${this._decrement}
          ?disabled=${decrementDisabled}
          aria-label="Decrement"
          tabindex="-1"
          type="button"
        >
          <svg class=${ICON_SIZE[s]} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M5 12h14"/></svg>
        </button>
        <input
          class=${inputClasses}
          type="number"
          .value=${String(this.value)}
          ?disabled=${this.disabled}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          name=${this.name ?? nothing}
          min=${this.min ?? nothing}
          max=${this.max ?? nothing}
          step=${this.step}
          @input=${this._handleInput}
          @change=${this._handleChange}
          @keydown=${this._handleKeyDown}
        />
        <button
          class=${cx(btnBase, `border-l ${kbClasses.borderColor}`, incrementDisabled ? 'opacity-30 pointer-events-none' : '')}
          @click=${this._increment}
          ?disabled=${incrementDisabled}
          aria-label="Increment"
          tabindex="-1"
          type="button"
        >
          <svg class=${ICON_SIZE[s]} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-number-input': KbNumberInput;
  }
}
