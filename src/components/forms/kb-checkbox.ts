import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement, springPressDown, springPressUp } from '../../core/base-element.js';
import { lookupScheme } from '../../core/color-schemes.js';
import {
  CHECKBOX_DEFAULT_HOVER,
  CHECKBOX_HOVER_SCHEME,
  CHECKED_FILL_SCHEME,
  DEFAULT_CHECKED_FILL,
  FORM_DESCRIPTION_WRAPPER,
  FORM_DISABLED_CONTROL,
  FORM_DISABLED_LABEL,
  FORM_DISABLED_WRAPPER,
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
    box: string;
    tapWrap: string;
    label: string;
    icon: string;
    description: string;
  }
> = {
  xs: {
    box: 'w-3.5 h-3.5',
    tapWrap: 'inline-flex items-center justify-center min-w-[44px] min-h-[44px]',
    label: 'text-xs gap-1.5',
    icon: 'w-2.5 h-2.5',
    description: 'text-[10px]',
  },
  sm: { box: 'w-4 h-4', tapWrap: '', label: 'text-sm gap-2', icon: 'w-3 h-3', description: 'text-xs' },
  md: { box: 'w-5 h-5', tapWrap: '', label: 'text-sm gap-2.5', icon: 'w-3.5 h-3.5', description: 'text-xs' },
  lg: { box: 'w-6 h-6', tapWrap: '', label: 'text-base gap-3', icon: 'w-4 h-4', description: 'text-sm' },
  xl: { box: 'w-7 h-7', tapWrap: '', label: 'text-lg gap-3.5', icon: 'w-5 h-5', description: 'text-sm' },
} as const satisfies Record<
  ComponentSize,
  {
    box: string;
    tapWrap: string;
    label: string;
    icon: string;
    description: string;
  }
>;

const COLOR_SCHEME_CHECKED: Record<KnownColorScheme, string> = CHECKED_FILL_SCHEME;

const COLOR_SCHEME_ICON: Record<KnownColorScheme, string> = {
  blue: 'text-white',
  red: 'text-white',
  green: 'text-white',
  yellow: 'text-black dark:text-black',
  black: 'text-white dark:text-zinc-900',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_SCHEME_HOVER: Record<KnownColorScheme, string> = CHECKBOX_HOVER_SCHEME;

const DEFAULT_CHECKED: string = DEFAULT_CHECKED_FILL;
const DEFAULT_ICON: string = 'text-white';
const DEFAULT_HOVER: string = CHECKBOX_DEFAULT_HOVER;

/**
 * Checkbox control with SVG icons, animated state transitions, colorScheme support,
 * description slot, invalid state, and press feedback.
 *
 * @slot - Label content.
 * @slot description - Helper text rendered below the label.
 *
 * @fires kb-change - Checked state changed. Detail: `{ checked: boolean, value?: string }`.
 *
 * @example
 * ```html
 * <kb-checkbox checked color-scheme="green">
 *   Accept terms
 *   <span slot="description">You must accept to continue.</span>
 * </kb-checkbox>
 * ```
 */
export class KbCheckbox extends KbBaseElement<'description'> {
  /** Checkbox size controlling box dimensions, label text, and icon size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Whether the checkbox is checked. Reflects to the `checked` attribute. @defaultValue false */
  @property({ type: Boolean, reflect: true }) checked: boolean = false;
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Show a horizontal dash icon instead of a checkmark (third state). @defaultValue false */
  @property({ type: Boolean }) indeterminate: boolean = false;
  /** Apply error border styling when unchecked. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Color scheme for the checked/indeterminate state background and icon. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Form field name, used in form submissions. */
  @property({ type: String }) name?: string;
  /** Value included in `kb-change` event detail and form submissions. */
  @property({ type: String }) value?: string;

  private _boxEl: HTMLElement | null = null;

  override firstUpdated(): void {
    if (isServer) return;
    this._boxEl = this.querySelector<HTMLElement>('[role="checkbox"]');
  }

  private _onPointerDown(_e: PointerEvent): void {
    if (this.disabled) return;
    if (this._boxEl) springPressDown(this._boxEl, 0.9);
  }

  private _onPointerUp(_e: PointerEvent): void {
    if (this._boxEl) springPressUp(this._boxEl);
  }

  private _toggle(): void {
    if (this.disabled) return;
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    this.emit('kb-change', { source: 'checkbox', checked: this.checked, value: this.value ?? '' });
  }

  private _handleLabelClick(e: MouseEvent): void {
    e.preventDefault();
    this._toggle();
  }

  private _handleBoxKeydown(e: KeyboardEvent): void {
    if (e.key === ' ') {
      e.preventDefault();
      this._toggle();
    }
  }

  private _onFocus(): void {
    this.emit('kb-focus');
  }

  private _onBlur(): void {
    this.emit('kb-blur');
  }

  private _computeBorderColor(isActive: boolean): string {
    if (this.invalid && !isActive) return FORM_INVALID_BORDER;
    if (isActive) return '';
    return FORM_UNCHECKED_BORDER;
  }

  private _computeBoxClasses(s: (typeof SIZE_MAP)[ComponentSize], isActive: boolean): string {
    const cs = this.colorScheme;
    const checkedBg = isActive
      ? (lookupScheme(COLOR_SCHEME_CHECKED, cs) ?? DEFAULT_CHECKED)
      : 'bg-white dark:bg-transparent';

    const iconColor = isActive ? (lookupScheme(COLOR_SCHEME_ICON, cs) ?? DEFAULT_ICON) : '';
    const hoverBorder = isActive || this.disabled ? '' : (lookupScheme(COLOR_SCHEME_HOVER, cs) ?? DEFAULT_HOVER);

    return cx(
      s.box,
      'border flex items-center justify-center shrink-0',
      kbClasses.transitionColors,
      checkedBg,
      iconColor,
      this._computeBorderColor(isActive),
      hoverBorder,
      kbClasses.focus,
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );
  }

  private _renderCheckIcon(s: (typeof SIZE_MAP)[ComponentSize]): TemplateResult | typeof nothing {
    if (this.indeterminate) {
      return html`<svg class="${s.icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M5 12h14" class="animate-kb-check-draw" style="stroke-dasharray:14;stroke-dashoffset:0"/></svg>`;
    }
    if (this.checked) {
      return html`<svg class="${s.icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M5 12l5 5L19 7" class="animate-kb-check-draw" style="stroke-dasharray:24;stroke-dashoffset:0"/></svg>`;
    }
    return nothing;
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

  private _renderBoxSpan(s: (typeof SIZE_MAP)[ComponentSize], boxClasses: string): TemplateResult {
    const inner = html`<span
      class=${boxClasses}
      tabindex=${this.disabled ? '-1' : '0'}
      role="checkbox"
      aria-checked=${this.indeterminate ? 'mixed' : String(this.checked)}
      aria-invalid=${this.invalid ? 'true' : nothing}
      @keydown=${this._handleBoxKeydown}
      @focus=${this._onFocus}
      @blur=${this._onBlur}
    >
      ${this._renderCheckIcon(s)}
    </span>`;
    if (s.tapWrap) {
      return html`<span class=${s.tapWrap}>${inner}</span>`;
    }
    return inner;
  }

  override render(): TemplateResult {
    const s = SIZE_MAP[this.size];
    const isActive = this.checked || this.indeterminate;

    const boxClasses = this._computeBoxClasses(s, isActive);

    const wrapperClasses = this.buildClasses(
      'group/cb inline-flex items-start font-sans select-none',
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
          type="checkbox"
          class="sr-only"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          name=${this.name ?? ''}
          value=${this.value ?? ''}
          tabindex="-1"
          aria-hidden="true"
        />
        ${this._renderBoxSpan(s, boxClasses)}
        ${this._renderLabelContent(s)}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-checkbox': KbCheckbox;
  }
}
