import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { lookupScheme } from '../../core/color-schemes.js';
import {
  buildDefaultGroupHover,
  buildGroupHoverScheme,
  FORM_DESCRIPTION_WRAPPER,
  FORM_INVALID_BORDER,
  FORM_INVALID_TEXT,
  FORM_UNCHECKED_BORDER,
} from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, KnownColorScheme } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const SIZE_MAP: Record<
  ComponentSize,
  {
    outer: string;
    inner: string;
    label: string;
    description: string;
  }
> = {
  xs: { outer: 'w-3.5 h-3.5', inner: 'r="4"', label: 'text-xs gap-1.5', description: 'text-[10px]' },
  sm: { outer: 'w-4 h-4', inner: 'r="4.5"', label: 'text-sm gap-2', description: 'text-xs' },
  md: { outer: 'w-5 h-5', inner: 'r="5"', label: 'text-sm gap-2.5', description: 'text-xs' },
  lg: { outer: 'w-6 h-6', inner: 'r="5.5"', label: 'text-base gap-3', description: 'text-sm' },
  xl: { outer: 'w-7 h-7', inner: 'r="6"', label: 'text-lg gap-3.5', description: 'text-sm' },
} as const satisfies Record<
  ComponentSize,
  {
    outer: string;
    inner: string;
    label: string;
    description: string;
  }
>;

const COLOR_SCHEME_CHECKED: Record<KnownColorScheme, string> = {
  blue: 'border-blue-500 dark:border-blue-400',
  red: 'border-red-500 dark:border-red-400',
  green: 'border-green-500 dark:border-green-400',
  yellow: 'border-yellow-500 dark:border-yellow-400',
  black: 'border-gray-900 dark:border-zinc-100',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_SCHEME_DOT: Record<KnownColorScheme, string> = {
  blue: 'fill-blue-500 dark:fill-blue-400',
  red: 'fill-red-500 dark:fill-red-400',
  green: 'fill-green-500 dark:fill-green-400',
  yellow: 'fill-yellow-500 dark:fill-yellow-400',
  black: 'fill-gray-900 dark:fill-zinc-100',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_SCHEME_HOVER: Record<KnownColorScheme, string> = buildGroupHoverScheme('radio');

const DEFAULT_CHECKED: string = 'border-blue-500 dark:border-blue-400';
const DEFAULT_DOT: string = 'fill-blue-500 dark:fill-blue-400';
const DEFAULT_HOVER: string = buildDefaultGroupHover('radio');

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
export class KbRadio extends KbBaseElement<'description'> {
  /** Radio button size controlling circle dimensions, label text, and dot size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Whether this radio is selected. Reflects to the `checked` attribute. @defaultValue false */
  @property({ type: Boolean, reflect: true }) checked: boolean = false;
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error border styling when unchecked. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Color scheme for the selected state border and dot fill. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Form field name. Should match across radios in the same group. */
  @property({ type: String }) name?: string;
  /** Value emitted in `kb-change` event detail when this radio is selected. @defaultValue '' */
  @property({ type: String }) value: string = '';

  @state() private _pressed = false;

  private _select(): void {
    if (this.disabled || this.checked) return;
    this.checked = true;
    this.emit('kb-change', { source: 'radio', value: this.value, checked: true });
  }

  private _onPointerDown(): void {
    if (!this.disabled) this._pressed = true;
  }

  private _onPointerUp(): void {
    this._pressed = false;
  }

  private _handleLabelClick(e: MouseEvent): void {
    e.preventDefault();
    this._select();
  }

  private _handleCircleKeydown(e: KeyboardEvent): void {
    if (e.key === ' ') {
      e.preventDefault();
      this._select();
    }
  }

  override render(): TemplateResult {
    const s = SIZE_MAP[this.size];
    const cs = this.colorScheme;

    const checkedBorder = this.checked ? (lookupScheme(COLOR_SCHEME_CHECKED, cs) ?? DEFAULT_CHECKED) : '';

    const dotColor = this.checked ? (lookupScheme(COLOR_SCHEME_DOT, cs) ?? DEFAULT_DOT) : '';

    const hoverBorder = this.checked || this.disabled ? '' : (lookupScheme(COLOR_SCHEME_HOVER, cs) ?? DEFAULT_HOVER);

    let borderColor: string;
    if (this.invalid && !this.checked) borderColor = FORM_INVALID_BORDER;
    else if (this.checked) borderColor = '';
    else borderColor = FORM_UNCHECKED_BORDER;

    const circleClasses = cx(
      s.outer,
      'rounded-full border flex items-center justify-center shrink-0',
      kbClasses.transition,
      checkedBorder,
      borderColor,
      hoverBorder,
      this._pressed ? 'scale-90' : '',
      kbClasses.focus,
    );

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
      ? html`<span class="${FORM_DESCRIPTION_WRAPPER}">
          <span>${this.defaultSlotContent}</span>
          <span class="${s.description} ${this.invalid ? FORM_INVALID_TEXT : kbClasses.textSecondary}">${descriptionEl}</span>
        </span>`
      : this.defaultSlotContent;

    return html`
      <label
        class=${wrapperClasses}
        @click=${this._handleLabelClick}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointerleave=${this._onPointerUp}
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
          @keydown=${this._handleCircleKeydown}
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
