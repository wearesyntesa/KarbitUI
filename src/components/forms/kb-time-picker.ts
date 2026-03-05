import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import {
  CLEAR_SIZE,
  FORM_CLEAR_CLASSES,
  FORM_DISABLED_CONTROL,
  type FormVariant,
  SIZE_GAP,
  SIZE_PADDING,
  SIZE_TEXT,
  VARIANT_WRAPPER,
  VARIANT_WRAPPER_INVALID,
} from '../../core/form-tokens.js';
import { renderCloseIcon } from '../../core/icons.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type TimeFormat = '12h' | '24h';

const PANEL_ID_PREFIX = 'kb-time-panel-';

let instanceCounter = 0;

/**
 * Time picker with hour/minute scrollable columns in a dropdown popover.
 *
 * @fires kb-change - Value changed. Detail: `{ source: 'time-picker', value: string }`.
 * @fires kb-focus - Focused.
 * @fires kb-blur - Blurred.
 * @fires kb-clear - Cleared.
 *
 * @example
 * ```html
 * <kb-time-picker value="14:30" format="24h" minute-step="5"></kb-time-picker>
 * ```
 */
export class KbTimePicker extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Current value in HH:MM format. @defaultValue '' */
  @property({ type: String }) value: string = '';
  /** Time format. @defaultValue '24h' */
  @property({ type: String }) format: TimeFormat = '24h';
  /** Minute step interval. @defaultValue 1 */
  @property({ type: Number, attribute: 'minute-step' }) minuteStep: number = 1;
  /** Placeholder text. */
  @property({ type: String }) placeholder?: string;
  /** Visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Display size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Show clear button. @defaultValue false */
  @property({ type: Boolean }) clearable: boolean = false;
  /** Form field name. */
  @property({ type: String }) name?: string;

  @state() private _open: boolean = false;
  @state() private _selectedHour: number = -1;
  @state() private _selectedMinute: number = -1;
  @state() private _selectedPeriod: 'AM' | 'PM' = 'AM';

  private _instanceId: number;
  private readonly _panelId: string;
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _docListenersActive = false;
  private _cachedCloseIcon: TemplateResult | null = null;

  constructor() {
    super();
    this._instanceId = instanceCounter++;
    this._panelId = `${PANEL_ID_PREFIX}${this._instanceId}`;
  }

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (this._cachedCloseIcon === null || changed.has('size')) {
      this._cachedCloseIcon = renderCloseIcon(CLEAR_SIZE[this.size]);
    }
    if (changed.has('value') && this.value) {
      this._parseValue();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._detachDocListeners();
  }

  private _parseValue(): void {
    const match = /^(\d{1,2}):(\d{2})$/.exec(this.value);
    if (!match) return;
    let hour = Number.parseInt(match[1] as string, 10);
    const minute = Number.parseInt(match[2] as string, 10);
    if (this.format === '12h') {
      this._selectedPeriod = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
    }
    this._selectedHour = hour;
    this._selectedMinute = minute;
  }

  private _attachDocListeners(): void {
    if (this._docListenersActive) return;
    document.addEventListener('mousedown', this._boundOutsideClick, true);
    this._docListenersActive = true;
  }

  private _detachDocListeners(): void {
    if (!this._docListenersActive) return;
    document.removeEventListener('mousedown', this._boundOutsideClick, true);
    this._docListenersActive = false;
  }

  private _handleOutsideClick(e: MouseEvent): void {
    if (!this._open) return;
    if (!this.contains(e.target as Node)) this._close();
  }

  private _open_(): void {
    if (this.disabled) return;
    this._attachDocListeners();
    this._open = true;
    if (this.value) this._parseValue();
    requestAnimationFrame(() => {
      const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
      if (panel) {
        panel
          .animate(
            [
              { opacity: 0, transform: 'scale(0.97)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: prefersReducedMotion() ? 0 : 120, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' },
          )
          .finished.then(
            (a) => {
              a.commitStyles();
              a.cancel();
            },
            (_e: unknown) => {
              /* cancelled — no-op */
            },
          );
      }
    });
  }

  private _close(): void {
    if (!this._open) return;
    const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
    if (panel) {
      const anim = panel.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.97)' },
        ],
        { duration: prefersReducedMotion() ? 0 : 80, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
      );
      anim.finished.then(
        () => {
          anim.commitStyles();
          anim.cancel();
          this._finishClose();
        },
        () => this._finishClose(),
      );
    } else {
      this._finishClose();
    }
  }

  private _finishClose(): void {
    this._open = false;
    this._detachDocListeners();
  }

  private _toggle(): void {
    if (this._open) {
      this._close();
    } else {
      this._open_();
    }
  }

  private _formatValue(hour: number, minute: number, period: 'AM' | 'PM'): string {
    let h = hour;
    if (this.format === '12h') {
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
    }
    return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  private _getDisplayText(): string {
    if (!this.value) return this.placeholder ?? '';
    if (this.format === '12h' && this._selectedHour >= 0) {
      return `${this._selectedHour}:${String(this._selectedMinute).padStart(2, '0')} ${this._selectedPeriod}`;
    }
    return this.value;
  }

  private _selectHour(h: number): void {
    this._selectedHour = h;
    const minute = this._selectedMinute >= 0 ? this._selectedMinute : 0;
    this._selectedMinute = minute;
    this._commitValue(h, minute, this._selectedPeriod);
  }

  private _selectMinute(m: number): void {
    this._selectedMinute = m;
    const hour = this._selectedHour >= 0 ? this._selectedHour : this.format === '24h' ? 0 : 12;
    this._selectedHour = hour;
    this._commitValue(hour, m, this._selectedPeriod);
  }

  private _selectPeriod(p: 'AM' | 'PM'): void {
    this._selectedPeriod = p;
    if (this._selectedHour >= 0 && this._selectedMinute >= 0) {
      this._commitValue(this._selectedHour, this._selectedMinute, p);
    }
  }

  private _commitValue(hour: number, minute: number, period: 'AM' | 'PM'): void {
    const newValue = this._formatValue(hour, minute, period);
    this.value = newValue;
    this.emit('kb-change', { source: 'time-picker', value: newValue });
  }

  private _handleClear(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.value = '';
    this._selectedHour = -1;
    this._selectedMinute = -1;
    this.emit('kb-change', { source: 'time-picker', value: '' });
    this.emit('kb-clear');
  }

  private _handleTriggerFocus(): void {
    this.emit('kb-focus');
  }

  private _handleTriggerBlur(e: FocusEvent): void {
    const related = e.relatedTarget as Node | null;
    if (related && this.contains(related)) return;
    if (this._open) this._close();
    this.emit('kb-blur');
  }

  private _handleTriggerKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this._open) this._open_();
    }
    if (e.key === 'Escape' && this._open) {
      e.preventDefault();
      this._close();
    }
  }

  private _buildHours(): number[] {
    const max = this.format === '24h' ? 24 : 12;
    const start = this.format === '24h' ? 0 : 1;
    const hours: number[] = [];
    for (let i = start; i < start + max; i++) {
      hours.push(this.format === '24h' ? i : i);
    }
    return hours;
  }

  private _buildMinutes(): number[] {
    const minutes: number[] = [];
    const step = Math.max(1, this.minuteStep);
    for (let i = 0; i < 60; i += step) {
      minutes.push(i);
    }
    return minutes;
  }

  private _renderColumn(
    items: Array<{ value: number; label: string; selected: boolean }>,
    onSelect: (v: number) => void,
  ): TemplateResult {
    const s = this.size;
    return html`
      <div class="flex-1 overflow-y-auto max-h-48" @mousedown=${(e: Event): void => e.preventDefault()}>
        ${items.map(
          (item) => html`
            <div
              class=${cx(
                'cursor-pointer select-none text-center',
                SIZE_TEXT[s],
                'py-1.5',
                item.selected
                  ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : `${kbClasses.textPrimary} hover:bg-gray-100 dark:hover:bg-zinc-800`,
                kbClasses.transitionColors,
              )}
              @click=${(): void => onSelect(item.value)}
            >${item.label}</div>
          `,
        )}
      </div>
    `;
  }

  private _renderPanel(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const hours = this._buildHours().map((h) => ({
      value: h,
      label: String(h).padStart(2, '0'),
      selected: h === this._selectedHour,
    }));
    const minutes = this._buildMinutes().map((m) => ({
      value: m,
      label: String(m).padStart(2, '0'),
      selected: m === this._selectedMinute,
    }));

    const panelClasses = cx('absolute z-50 left-0 right-0 top-full mt-1', kbClasses.surface, kbClasses.border, 'flex');

    return html`
      <div id=${this._panelId} class=${panelClasses}>
        <div class="flex-1 flex flex-col">
          <div class=${cx(kbClasses.label, 'text-center py-1 border-b', kbClasses.borderColor)}>HR</div>
          ${this._renderColumn(hours, (h) => this._selectHour(h))}
        </div>
        <div class=${cx('w-px', kbClasses.borderColor, 'bg-gray-200 dark:bg-zinc-700')}></div>
        <div class="flex-1 flex flex-col">
          <div class=${cx(kbClasses.label, 'text-center py-1 border-b', kbClasses.borderColor)}>MIN</div>
          ${this._renderColumn(minutes, (m) => this._selectMinute(m))}
        </div>
        ${
          this.format === '12h'
            ? html`
            <div class=${cx('w-px', kbClasses.borderColor, 'bg-gray-200 dark:bg-zinc-700')}></div>
            <div class="flex-1 flex flex-col">
              <div class=${cx(kbClasses.label, 'text-center py-1 border-b', kbClasses.borderColor)}>&nbsp;</div>
              ${this._renderColumn(
                [
                  { value: 0, label: 'AM', selected: this._selectedPeriod === 'AM' },
                  { value: 1, label: 'PM', selected: this._selectedPeriod === 'PM' },
                ],
                (v) => this._selectPeriod(v === 0 ? 'AM' : 'PM'),
              )}
            </div>
          `
            : nothing
        }
      </div>
    `;
  }

  private _renderClockIcon(): TemplateResult {
    return html`<svg class="${CLEAR_SIZE[this.size]} shrink-0 ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
  }

  override render(): TemplateResult {
    const s = this.size;
    const isFlushed = this.variant === 'flushed';
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];
    const displayText = this._getDisplayText();
    const hasValue = this.value !== '';

    const outerClasses = this.buildClasses(
      'relative flex items-stretch w-full font-sans',
      kbClasses.transitionColors,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const innerClasses = cx('flex items-center flex-1', SIZE_PADDING[s], SIZE_GAP[s], isFlushed ? wrapperBorder : '');

    const textClasses = cx(
      'flex-1 min-w-0 text-left truncate select-none',
      SIZE_TEXT[s],
      hasValue ? kbClasses.textPrimary : 'text-slate-400 dark:text-zinc-500',
      this.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    );

    return html`
      <div class=${outerClasses}>
        <div
          class=${innerClasses}
          role="combobox"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-haspopup="dialog"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-controls=${this._open ? this._panelId : nothing}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this._toggle}
          @keydown=${this._handleTriggerKeyDown}
          @focus=${this._handleTriggerFocus}
          @blur=${this._handleTriggerBlur}
        >
          ${this._renderClockIcon()}
          <span class=${textClasses}>${displayText}</span>
          ${this.clearable && hasValue && !this.disabled ? html`<button class="${FORM_CLEAR_CLASSES}" @click=${this._handleClear} type="button" aria-label="Clear time" tabindex="-1">${this._cachedCloseIcon}</button>` : nothing}
        </div>
        ${this._renderPanel()}
        ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-time-picker': KbTimePicker;
  }
}
