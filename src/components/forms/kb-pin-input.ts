import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { FORM_DISABLED_CONTROL, SIZE_TEXT, VARIANT_WRAPPER, VARIANT_WRAPPER_INVALID } from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type PinInputType = 'numeric' | 'alphanumeric';

const CELL_SIZE: Record<ComponentSize, string> = {
  xs: 'w-7 h-7',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',
} as const satisfies Record<ComponentSize, string>;

const CELL_GAP: Record<ComponentSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
} as const satisfies Record<ComponentSize, string>;

const NUMERIC_PATTERN = /^[0-9]$/;
const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9]$/;

/**
 * Multi-digit OTP/verification code input with auto-advance, paste support, and completion events.
 *
 * @fires kb-input - Fires on every character change. Detail: `{ value: string }`.
 * @fires kb-change - Fires on value commit. Detail: `{ source: 'pin-input', value: string }`.
 * @fires kb-complete - Fires when all inputs are filled. Detail: `{ value: string }`.
 *
 * @example
 * ```html
 * <kb-pin-input length="6" type="numeric"></kb-pin-input>
 * ```
 */
export class KbPinInput extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Number of input fields. @defaultValue 4 */
  @property({ type: Number }) length: number = 4;
  /** Input type constraint. @defaultValue 'numeric' */
  @property({ type: String }) type: PinInputType = 'numeric';
  /** Show dots instead of characters. @defaultValue false */
  @property({ type: Boolean }) mask: boolean = false;
  /** Input size controlling cell dimensions and font size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error border styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Form field name. */
  @property({ type: String }) name?: string;
  /** Current combined value. @defaultValue '' */
  @property({ type: String }) value: string = '';

  private _getInputs(): HTMLInputElement[] {
    return Array.from(this.querySelectorAll<HTMLInputElement>('[data-kb-pin]'));
  }

  private _isValidChar(char: string): boolean {
    const pattern = this.type === 'numeric' ? NUMERIC_PATTERN : ALPHANUMERIC_PATTERN;
    return pattern.test(char);
  }

  private _collectValue(): string {
    return this._getInputs()
      .map((input) => input.value)
      .join('');
  }

  private _syncFromValue(): void {
    const inputs = this._getInputs();
    const chars = this.value.split('');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input) input.value = chars[i] ?? '';
    }
  }

  private _emitEvents(val: string): void {
    this.value = val;
    this.emit('kb-input', { value: val });
    this.emit('kb-change', { source: 'pin-input', value: val });
    if (val.length === this.length) {
      this.emit('kb-complete', { value: val });
    }
  }

  private _handleInput(e: InputEvent, index: number): void {
    const target = e.target as HTMLInputElement;
    const inputs = this._getInputs();

    if (e.inputType === 'insertFromPaste') return;

    const char = target.value.slice(-1);
    if (char && !this._isValidChar(char)) {
      target.value = '';
      return;
    }

    target.value = char;
    const val = this._collectValue();
    this._emitEvents(val);

    if (char && index < inputs.length - 1) {
      const next = inputs[index + 1];
      if (next) {
        next.focus();
        next.select();
      }
    }
  }

  private _handleKeyDown(e: KeyboardEvent, index: number): void {
    const target = e.target as HTMLInputElement;
    const inputs = this._getInputs();

    if (e.key === 'Backspace') {
      this._handleBackspace(target, inputs, index);
      e.preventDefault();
      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prev = inputs[index - 1];
      if (prev) {
        prev.focus();
        prev.select();
      }
      return;
    }

    if (e.key === 'ArrowRight' && index < inputs.length - 1) {
      e.preventDefault();
      const next = inputs[index + 1];
      if (next) {
        next.focus();
        next.select();
      }
    }
  }

  private _handleBackspace(target: HTMLInputElement, inputs: HTMLInputElement[], index: number): void {
    if (target.value) {
      target.value = '';
      this._emitEvents(this._collectValue());
      return;
    }
    if (index > 0) {
      const prev = inputs[index - 1];
      if (prev) {
        prev.value = '';
        prev.focus();
      }
      this._emitEvents(this._collectValue());
    }
  }

  private _handlePaste(e: ClipboardEvent): void {
    e.preventDefault();
    const pasted = e.clipboardData?.getData('text') ?? '';
    const inputs = this._getInputs();
    const target = e.target as HTMLInputElement;
    const startIndex = inputs.indexOf(target);
    if (startIndex === -1) return;

    let fillIndex = startIndex;
    for (let charIndex = 0; charIndex < pasted.length && fillIndex < inputs.length; charIndex++) {
      const char = pasted.charAt(charIndex);
      if (this._isValidChar(char)) {
        const input = inputs[fillIndex];
        if (input) input.value = char;
        fillIndex++;
      }
    }

    const val = this._collectValue();
    this._emitEvents(val);

    const nextEmpty = inputs.findIndex((inp) => !inp.value);
    if (nextEmpty !== -1) {
      inputs[nextEmpty]?.focus();
    } else {
      inputs[inputs.length - 1]?.focus();
    }
  }

  private _handleFocus(e: FocusEvent): void {
    const target = e.target as HTMLInputElement;
    target.select();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (changed.has('value') || changed.has('length')) {
      this._syncFromValue();
    }
  }

  override render(): TemplateResult {
    const s = this.size;
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID.outline : VARIANT_WRAPPER.outline;

    const outerClasses = this.buildClasses(
      'inline-flex items-center font-sans max-w-full flex-wrap',
      CELL_GAP[s],
      this.disabled ? kbClasses.disabledLook : '',
    );

    const cellClasses = cx(
      'bg-white dark:bg-transparent outline-none',
      SIZE_TEXT[s],
      kbClasses.textPrimary,
      kbClasses.focus,
      kbClasses.transitionColors,
      CELL_SIZE[s],
      wrapperBorder,
      this.disabled ? FORM_DISABLED_CONTROL : '',
      'text-center font-mono tabular-nums select-all',
      'p-0 flex-none',
    );

    const indices = Array.from({ length: this.length }, (_, i) => i);

    return html`
      <div class=${outerClasses} role="group" aria-label="PIN input">
        ${indices.map(
          (i) => html`
            <input
              class=${cellClasses}
              data-kb-pin=${i}
              type=${this.mask ? 'password' : 'text'}
              inputmode=${this.type === 'numeric' ? 'numeric' : 'text'}
              pattern=${this.type === 'numeric' ? '[0-9]' : '[a-zA-Z0-9]'}
              maxlength="1"
              ?disabled=${this.disabled}
              aria-invalid=${this.invalid ? 'true' : 'false'}
              aria-label=${`PIN digit ${String(i + 1)} of ${String(this.length)}`}
              autocomplete=${i === 0 ? 'one-time-code' : 'off'}
              name=${this.name ? `${this.name}-${String(i)}` : ''}
              @input=${(e: InputEvent): void => this._handleInput(e, i)}
              @keydown=${(e: KeyboardEvent): void => this._handleKeyDown(e, i)}
              @paste=${(e: ClipboardEvent): void => this._handlePaste(e)}
              @focus=${(e: FocusEvent): void => this._handleFocus(e)}
            />
          `,
        )}
        ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-pin-input': KbPinInput;
  }
}
