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
  FORM_INVALID_TEXT,
  SWITCH_DEFAULT_HOVER,
  SWITCH_HOVER_SCHEME,
} from '../../core/form-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, KnownColorScheme } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type SwitchLabelPosition = 'left' | 'right';

const SIZE_MAP: Record<
  ComponentSize,
  {
    track: string;
    thumb: string;
    translate: string;
    label: string;
    description: string;
    gap: string;
    icon: string;
    spinner: string;
  }
> = {
  xs: {
    track: 'w-6 h-3',
    thumb: 'w-3 h-3',
    translate: 'translate-x-3',
    label: 'text-xs',
    description: 'text-[10px]',
    gap: 'gap-1.5',
    icon: 'w-1.5 h-1.5',
    spinner: 'w-1.5 h-1.5 border',
  },
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-4 h-4',
    translate: 'translate-x-4',
    label: 'text-sm',
    description: 'text-xs',
    gap: 'gap-2',
    icon: 'w-2 h-2',
    spinner: 'w-2 h-2 border',
  },
  md: {
    track: 'w-10 h-5',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
    label: 'text-sm',
    description: 'text-xs',
    gap: 'gap-2.5',
    icon: 'w-2.5 h-2.5',
    spinner: 'w-2.5 h-2.5 border',
  },
  lg: {
    track: 'w-12 h-6',
    thumb: 'w-6 h-6',
    translate: 'translate-x-6',
    label: 'text-base',
    description: 'text-sm',
    gap: 'gap-3',
    icon: 'w-3 h-3',
    spinner: 'w-3 h-3 border-2',
  },
  xl: {
    track: 'w-14 h-7',
    thumb: 'w-7 h-7',
    translate: 'translate-x-7',
    label: 'text-lg',
    description: 'text-sm',
    gap: 'gap-3.5',
    icon: 'w-3.5 h-3.5',
    spinner: 'w-3.5 h-3.5 border-2',
  },
} as const satisfies Record<
  ComponentSize,
  {
    track: string;
    thumb: string;
    translate: string;
    label: string;
    description: string;
    gap: string;
    icon: string;
    spinner: string;
  }
>;

const COLOR_SCHEME_TRACK: Record<KnownColorScheme, string> = CHECKED_FILL_SCHEME;

const COLOR_SCHEME_HOVER: Record<KnownColorScheme, string> = SWITCH_HOVER_SCHEME;

const COLOR_SCHEME_ICON: Record<KnownColorScheme, string> = {
  blue: 'text-blue-500 dark:text-blue-500',
  red: 'text-red-500 dark:text-red-600',
  green: 'text-green-500 dark:text-green-600',
  yellow: 'text-yellow-500 dark:text-yellow-500',
  black: 'text-gray-900 dark:text-zinc-100',
} as const satisfies Record<KnownColorScheme, string>;

const DEFAULT_TRACK: string = DEFAULT_CHECKED_FILL;
const DEFAULT_HOVER: string = SWITCH_DEFAULT_HOVER;
const DEFAULT_ICON: string = 'text-blue-500 dark:text-blue-500';

/**
 * Toggle switch with colorScheme, description slot, animated thumb, optional icons,
 * loading state, label positioning, invalid state, and press feedback.
 *
 * @slot - Label content.
 * @slot description - Helper text rendered below the label.
 *
 * @fires kb-change - Checked state changed. Detail: `{ checked: boolean }`.
 *
 * @example
 * ```html
 * <kb-switch checked color-scheme="green" show-icons>
 *   Dark Mode
 *   <span slot="description">Enable dark mode across the application</span>
 * </kb-switch>
 * ```
 */
export class KbSwitch extends KbBaseElement<'description'> {
  static override hostDisplay = 'inline-block' as const;

  /** Switch size controlling track, thumb, and label dimensions. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Whether the switch is on. Reflects to the `checked` attribute. @defaultValue false */
  @property({ type: Boolean, reflect: true }) checked: boolean = false;
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error border styling when unchecked. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Show a loading spinner inside the thumb and disable interaction. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;
  /** Show check/cross icons inside the thumb. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-icons' }) showIcons: boolean = false;
  /** Color scheme for the checked state track, icon, and hover border. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Position of the label relative to the switch track. @defaultValue 'right' */
  @property({ type: String, attribute: 'label-position' }) labelPosition: SwitchLabelPosition = 'right';
  /** Form field name, used in form submissions. */
  @property({ type: String }) name?: string;

  private _trackEl: HTMLElement | null = null;

  override firstUpdated(): void {
    if (isServer) return;
    this._trackEl = this.querySelector<HTMLElement>('[role="switch"]');
  }

  private _handleToggle(): void {
    if (this.disabled || this.loading) return;
    this.checked = !this.checked;
    this.emit('kb-change', { source: 'switch', checked: this.checked });
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._handleToggle();
    }
  }

  private _onFocus(): void {
    this.emit('kb-focus');
  }

  private _onBlur(): void {
    this.emit('kb-blur');
  }

  private _onPointerDown(_e: PointerEvent): void {
    if (this.disabled || this.loading) return;
    if (this._trackEl) springPressDown(this._trackEl, 0.95);
  }

  private _onPointerUp(_e: PointerEvent): void {
    if (this._trackEl) springPressUp(this._trackEl);
  }

  private _computeTrackClasses(s: (typeof SIZE_MAP)[ComponentSize]): string {
    const isDisabled = this.disabled || this.loading;
    const trackChecked = lookupScheme(COLOR_SCHEME_TRACK, this.colorScheme) ?? DEFAULT_TRACK;
    const trackUncheckedHover =
      isDisabled || this.checked ? '' : (lookupScheme(COLOR_SCHEME_HOVER, this.colorScheme) ?? DEFAULT_HOVER);
    const trackInvalid = this.invalid && !this.checked ? 'border-red-500 dark:border-red-500' : '';

    const trackBg = this.checked
      ? trackChecked
      : `bg-gray-300 border-gray-400 dark:bg-zinc-700 dark:border-zinc-600 ${trackUncheckedHover}`;

    return cx(
      s.track,
      'border relative inline-flex items-center shrink-0',
      'transition-colors duration-200 ease-in-out',
      trackBg,
      trackInvalid,
      'focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );
  }

  private _renderThumbContent(s: (typeof SIZE_MAP)[ComponentSize]): TemplateResult | typeof nothing {
    if (this.loading) {
      return html`<span class="${s.spinner} border-current border-t-transparent animate-spin" style="border-radius:9999px;border-style:solid"></span>`;
    }
    if (!this.showIcons) return nothing;

    const iconColor = this.checked
      ? (lookupScheme(COLOR_SCHEME_ICON, this.colorScheme) ?? DEFAULT_ICON)
      : kbClasses.textMuted;

    if (this.checked) {
      return html`<svg class="${s.icon} ${iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`;
    }
    return html`<svg class="${s.icon} ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  }

  private _renderLabelBlock(s: (typeof SIZE_MAP)[ComponentSize]): TemplateResult | typeof nothing {
    const descSlot = this.slotted('description');
    const hasLabel = this.defaultSlotContent.length > 0;
    if (!(hasLabel || descSlot)) return nothing;

    const labelClass: string = this.disabled ? FORM_DISABLED_LABEL : '';

    const labelEl = hasLabel
      ? html`<span class="${s.label} ${kbClasses.textPrimary} ${labelClass}">${this.defaultSlotContent}</span>`
      : nothing;

    const descEl = descSlot
      ? html`<span class="${s.description} ${this.invalid ? FORM_INVALID_TEXT : kbClasses.textSecondary}">${descSlot}</span>`
      : nothing;

    return html`<span class="${FORM_DESCRIPTION_WRAPPER}">
      ${labelEl}
      ${descEl}
    </span>`;
  }

  override render(): TemplateResult {
    const s = SIZE_MAP[this.size];
    const isDisabled = this.disabled || this.loading;

    const thumbClasses = cx(
      s.thumb,
      'absolute left-0 flex items-center justify-center',
      'bg-white dark:bg-zinc-200 border border-gray-300 dark:border-zinc-600',
      'transition-transform duration-200',
      this.checked ? s.translate : 'translate-x-0',
    );

    const wrapperClasses = this.buildClasses(
      `group/sw relative inline-flex items-center font-sans ${s.gap} select-none`,
      isDisabled ? FORM_DISABLED_WRAPPER : 'cursor-pointer',
      this.labelPosition === 'left' ? 'flex-row-reverse' : '',
    );

    return html`
      <label
        class=${wrapperClasses}
        @pointerdown=${this._onPointerDown}
        @pointerup=${this._onPointerUp}
        @pointerleave=${this._onPointerUp}
      >
        <input
          type="checkbox"
          style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border-width:0;-webkit-appearance:none;appearance:none;pointer-events:none"
          tabindex="-1"
          aria-hidden="true"
          .checked=${this.checked}
          ?disabled=${isDisabled}
          name=${this.name ?? ''}
        />
        <span class="inline-flex items-center justify-center min-w-[44px] min-h-[44px]">
          <span
            class=${this._computeTrackClasses(s)}
            role="switch"
            tabindex=${isDisabled ? '-1' : '0'}
            aria-checked=${this.checked ? 'true' : 'false'}
            @click=${this._handleToggle}
            @keydown=${this._handleKeydown}
            @focus=${this._onFocus}
            @blur=${this._onBlur}
          >
            <span class=${thumbClasses} style="transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)">
              ${this._renderThumbContent(s)}
            </span>
          </span>
        </span>
        ${this._renderLabelBlock(s)}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-switch': KbSwitch;
  }
}
