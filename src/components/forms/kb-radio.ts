import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize } from '../../core/types.js';

const SIZE_MAP: Record<ComponentSize, {
  outer: string;
  inner: string;
  label: string;
  description: string;
}> = {
  xs: { outer: 'w-3.5 h-3.5', inner: 'r="4"', label: 'text-xs gap-1.5', description: 'text-[10px]' },
  sm: { outer: 'w-4 h-4', inner: 'r="4.5"', label: 'text-sm gap-2', description: 'text-xs' },
  md: { outer: 'w-5 h-5', inner: 'r="5"', label: 'text-sm gap-2.5', description: 'text-xs' },
  lg: { outer: 'w-6 h-6', inner: 'r="5.5"', label: 'text-base gap-3', description: 'text-sm' },
  xl: { outer: 'w-7 h-7', inner: 'r="6"', label: 'text-lg gap-3.5', description: 'text-sm' },
};

const COLOR_SCHEME_CHECKED: Record<string, string> = {
  blue: 'border-blue-500 dark:border-blue-400',
  red: 'border-red-500 dark:border-red-400',
  green: 'border-green-500 dark:border-green-400',
  yellow: 'border-yellow-500 dark:border-yellow-400',
  black: 'border-gray-900 dark:border-zinc-100',
};

const COLOR_SCHEME_DOT: Record<string, string> = {
  blue: 'fill-blue-500 dark:fill-blue-400',
  red: 'fill-red-500 dark:fill-red-400',
  green: 'fill-green-500 dark:fill-green-400',
  yellow: 'fill-yellow-500 dark:fill-yellow-400',
  black: 'fill-gray-900 dark:fill-zinc-100',
};

const COLOR_SCHEME_HOVER: Record<string, string> = {
  blue: 'group-hover/radio:border-blue-400 dark:group-hover/radio:border-blue-400',
  red: 'group-hover/radio:border-red-400 dark:group-hover/radio:border-red-400',
  green: 'group-hover/radio:border-green-400 dark:group-hover/radio:border-green-400',
  yellow: 'group-hover/radio:border-yellow-400 dark:group-hover/radio:border-yellow-400',
  black: 'group-hover/radio:border-gray-600 dark:group-hover/radio:border-zinc-300',
};

const DEFAULT_CHECKED = 'border-blue-500 dark:border-blue-400';
const DEFAULT_DOT = 'fill-blue-500 dark:fill-blue-400';
const DEFAULT_HOVER = 'group-hover/radio:border-gray-500 dark:group-hover/radio:border-zinc-400';

/**
 * Radio button control with animated dot, colorScheme support,
 * description slot, invalid state, and press feedback.
 *
 * @slot - Label content.
 * @slot description - Helper text rendered below the label.
 *
 * @fires kb-change - Checked state changed. Detail: `{ checked: boolean, value: string }`.
 *
 * @example
 * ```html
 * <kb-radio name="plan" value="pro" checked color-scheme="green">
 *   Pro Plan
 *   <span slot="description">Unlimited access to all features.</span>
 * </kb-radio>
 * ```
 */
@customElement('kb-radio')
export class KbRadio extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: Boolean, reflect: true }) checked: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  @property({ type: String }) name?: string;
  @property({ type: String }) value: string = '';

  @state() private _pressed = false;

  private _select(): void {
    if (this.disabled || this.checked) return;
    this.checked = true;
    this.dispatchEvent(new CustomEvent('kb-change', {
      detail: { value: this.value, checked: true },
      bubbles: true,
      composed: true,
    }));
  }

  private _onPointerDown(): void {
    if (!this.disabled) this._pressed = true;
  }

  private _onPointerUp(): void {
    this._pressed = false;
  }

  override render() {
    const s = SIZE_MAP[this.size];
    const cs = this.colorScheme;

    const checkedBorder = this.checked
      ? (cs ? COLOR_SCHEME_CHECKED[cs] : undefined) ?? DEFAULT_CHECKED
      : '';

    const dotColor = this.checked
      ? (cs ? COLOR_SCHEME_DOT[cs] : undefined) ?? DEFAULT_DOT
      : '';

    const hoverBorder = !this.checked && !this.disabled
      ? (cs ? COLOR_SCHEME_HOVER[cs] : undefined) ?? DEFAULT_HOVER
      : '';

    const borderColor = this.invalid && !this.checked
      ? 'border-red-500 dark:border-red-400'
      : !this.checked
        ? 'border-gray-300 dark:border-zinc-600'
        : '';

    const circleClasses = [
      s.outer,
      'rounded-full border flex items-center justify-center shrink-0',
      'transition-all duration-150 ease-in-out',
      checkedBorder,
      borderColor,
      hoverBorder,
      this._pressed ? 'scale-90' : '',
      kbClasses.focus,
    ].filter(Boolean).join(' ');

    const wrapperClasses = this.buildClasses(
      'group/radio inline-flex items-start font-sans select-none',
      kbClasses.textPrimary,
      s.label,
      this.disabled ? kbClasses.disabled : 'cursor-pointer',
    );

    const descriptionEl = this.slotted('description');

    const dotEl = this.checked
      ? html`<svg class="w-full h-full animate-kb-radio-pop" viewBox="0 0 24 24"><circle cx="12" cy="12" ${s.inner} class="${dotColor}"/></svg>`
      : nothing;

    const labelContent = descriptionEl
      ? html`<span class="flex flex-col gap-0.5">
          <span>${this.defaultSlotContent}</span>
          <span class="${s.description} ${this.invalid ? 'text-red-500 dark:text-red-400' : kbClasses.textSecondary}">${descriptionEl}</span>
        </span>`
      : this.defaultSlotContent;

    return html`
      <label
        class=${wrapperClasses}
        @click=${(e: MouseEvent) => { e.preventDefault(); this._select(); }}
        @pointerdown=${() => this._onPointerDown()}
        @pointerup=${() => this._onPointerUp()}
        @pointerleave=${() => this._onPointerUp()}
      >
        <input
          type="radio"
          class="sr-only"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name ?? ''}
          value=${this.value}
          tabindex="-1"
          aria-hidden="true"
        />
        <span
          class=${circleClasses}
          tabindex=${this.disabled ? '-1' : '0'}
          role="radio"
          aria-checked=${this.checked ? 'true' : 'false'}
          aria-invalid=${this.invalid ? 'true' : nothing}
          @keydown=${(e: KeyboardEvent) => { if (e.key === ' ') { e.preventDefault(); this._select(); } }}
        >
          ${dotEl}
        </span>
        ${labelContent}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-radio': KbRadio;
  }
}
