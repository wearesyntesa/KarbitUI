import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement, springPressDown, springPressUp } from '../../core/base-element.js';
import { lookupScheme } from '../../core/color-schemes.js';
import {
  CHECKED_FILL_SCHEME,
  DEFAULT_CHECKED_FILL,
  FORM_DESCRIPTION_WRAPPER,
  FORM_DISABLED_CONTROL,
  FORM_DISABLED_LABEL,
  FORM_DISABLED_WRAPPER,
  FORM_INVALID_BORDER,
  FORM_INVALID_TEXT,
  FORM_UNCHECKED_BORDER,
  RADIO_DEFAULT_HOVER,
  RADIO_HOVER_SCHEME,
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
  xs: {
    outer: 'w-3.5 h-3.5',
    inner: 'r="4"',
    label: 'text-xs gap-1.5 min-h-[44px]',
    description: 'text-[10px]',
  },
  sm: {
    outer: 'w-4 h-4',
    inner: 'r="4.5"',
    label: 'text-sm gap-2 min-h-[44px]',
    description: 'text-xs',
  },
  md: {
    outer: 'w-5 h-5',
    inner: 'r="5"',
    label: 'text-sm gap-2.5 min-h-[44px]',
    description: 'text-xs',
  },
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

const COLOR_SCHEME_CHECKED: Record<KnownColorScheme, string> = CHECKED_FILL_SCHEME;

const COLOR_SCHEME_DOT: Record<KnownColorScheme, string> = {
  blue: 'fill-white',
  red: 'fill-white',
  green: 'fill-white',
  yellow: 'fill-black dark:fill-black',
  black: 'fill-white dark:fill-zinc-900',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_SCHEME_HOVER: Record<KnownColorScheme, string> = RADIO_HOVER_SCHEME;

const DEFAULT_CHECKED: string = DEFAULT_CHECKED_FILL;
const DEFAULT_DOT: string = 'fill-white';
const DEFAULT_HOVER: string = RADIO_DEFAULT_HOVER;

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
export class KbRadio extends KbBaseElement<'description'> {
  static override hostDisplay = 'inline-block' as const;

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
  /** Mark this radio as required for form validation. @defaultValue false */
  @property({ type: Boolean }) required: boolean = false;

  private _circleEl: HTMLElement | null = null;

  /** Returns the focusable circle span element (cached after first render). */
  get circleEl(): HTMLElement | null {
    return this._circleEl;
  }

  override firstUpdated(): void {
    if (isServer) return;
    this._circleEl = this.querySelector<HTMLElement>('[role="radio"]');
  }

  private _onPointerDown(_e: PointerEvent): void {
    if (this.disabled) return;
    const circle = this._circleEl;
    if (circle) springPressDown(circle, 0.9);
  }

  private _onPointerUp(_e: PointerEvent): void {
    const circle = this._circleEl;
    if (circle) springPressUp(circle);
  }

  private _select(): void {
    if (this.disabled || this.checked) return;
    this.checked = true;
    this.emit('kb-change', { source: 'radio', value: this.value, checked: true });
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

  private _onFocus(): void {
    this.emit('kb-focus');
  }

  private _onBlur(): void {
    this.emit('kb-blur');
  }

  private _computeBorderColor(): string {
    if (this.invalid && !this.checked) return FORM_INVALID_BORDER;
    if (this.checked) return '';
    return FORM_UNCHECKED_BORDER;
  }

  private _renderDot(s: (typeof SIZE_MAP)[ComponentSize], dotColor: string): TemplateResult | typeof nothing {
    if (!this.checked) return nothing;
    return html`<svg class="w-full h-full animate-kb-radio-pop" viewBox="0 0 24 24"><circle cx="12" cy="12" ${s.inner} class="${dotColor}"/></svg>`;
  }

  private _renderLabelContent(s: (typeof SIZE_MAP)[ComponentSize]): TemplateResult | Node[] {
    const labelClass: string = this.disabled ? FORM_DISABLED_LABEL : '';
    const descriptionEl = this.slotted('description');
    if (descriptionEl) {
      const descClass = this.invalid ? FORM_INVALID_TEXT : kbClasses.textSecondary;
      return html`<span class="${FORM_DESCRIPTION_WRAPPER}">
        <span class="${labelClass}">${this.defaultSlotContent}</span>
        <span class="${s.description} ${descClass}">${descriptionEl}</span>
      </span>`;
    }
    if (labelClass) {
      return html`<span class="${labelClass}">${this.defaultSlotContent}</span>`;
    }
    return this.defaultSlotContent;
  }

  private _renderCircleSpan(
    s: (typeof SIZE_MAP)[ComponentSize],
    circleClasses: string,
    dotColor: string,
  ): TemplateResult {
    return html`<span
      class=${circleClasses}
      style="border-radius:9999px"
      tabindex=${this.disabled ? '-1' : '0'}
      role="radio"
      aria-checked=${this.checked ? 'true' : 'false'}
      aria-required=${this.required ? 'true' : nothing}
      aria-invalid=${this.invalid ? 'true' : nothing}
      @keydown=${this._handleCircleKeydown}
      @focus=${this._onFocus}
      @blur=${this._onBlur}
    >
      ${this._renderDot(s, dotColor)}
    </span>`;
  }

  override render(): TemplateResult {
    const s = SIZE_MAP[this.size];
    const cs = this.colorScheme;

    const checkedFill = this.checked
      ? (lookupScheme(COLOR_SCHEME_CHECKED, cs) ?? DEFAULT_CHECKED)
      : 'bg-white dark:bg-transparent';
    const dotColor = this.checked ? (lookupScheme(COLOR_SCHEME_DOT, cs) ?? DEFAULT_DOT) : '';
    const hoverBorder = this.checked || this.disabled ? '' : (lookupScheme(COLOR_SCHEME_HOVER, cs) ?? DEFAULT_HOVER);

    const circleClasses = cx(
      s.outer,
      'border flex items-center justify-center shrink-0',
      kbClasses.transitionColors,
      checkedFill,
      this._computeBorderColor(),
      hoverBorder,
      kbClasses.focus,
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const wrapperClasses = this.buildClasses(
      'group/radio relative inline-flex items-center font-sans select-none',
      kbClasses.textPrimary,
      s.label,
      this.disabled ? FORM_DISABLED_WRAPPER : 'cursor-pointer',
    );

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
          style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border-width:0;-webkit-appearance:none;appearance:none;pointer-events:none"
          .checked=${this.checked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name ?? ''}
          value=${this.value}
          tabindex="-1"
          aria-hidden="true"
        />
        ${this._renderCircleSpan(s, circleClasses, dotColor)}
        ${this._renderLabelContent(s)}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-radio': KbRadio;
  }
}
