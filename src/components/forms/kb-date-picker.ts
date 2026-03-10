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

type DatePickerView = 'days' | 'months' | 'years';

const PANEL_ID_PREFIX = 'kb-date-panel-';
const DAY_LABELS: readonly string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_SHORT: readonly string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEARS_PER_PAGE = 12;

const CELL_SIZE: Record<ComponentSize, string> = {
  xs: 'w-7 h-7',
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-10 h-10',
  xl: 'w-11 h-11',
} as const satisfies Record<ComponentSize, string>;

const CELL_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-base',
} as const satisfies Record<ComponentSize, string>;

const MONTH_CELL_SIZE: Record<ComponentSize, string> = {
  xs: 'px-2 py-2',
  sm: 'px-3 py-2.5',
  md: 'px-4 py-3',
  lg: 'px-5 py-3.5',
  xl: 'px-6 py-4',
} as const satisfies Record<ComponentSize, string>;

const HEADER_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-base',
} as const satisfies Record<ComponentSize, string>;

const NAV_ICON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-5 h-5',
} as const satisfies Record<ComponentSize, string>;

const PANEL_PADDING: Record<ComponentSize, string> = {
  xs: 'p-2',
  sm: 'p-2.5',
  md: 'p-3',
  lg: 'p-4',
  xl: 'p-4',
} as const satisfies Record<ComponentSize, string>;

let instanceCounter = 0;

interface CalendarDay {
  readonly date: number;
  readonly month: number;
  readonly year: number;
  readonly iso: string;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly isSelected: boolean;
  readonly isDisabledRange: boolean;
}

function toIso(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseIso(s: string): { y: number; m: number; d: number } | null {
  const match = DATE_RE.exec(s);
  if (!match) return null;
  return {
    y: Number.parseInt(match[1] as string, 10),
    m: Number.parseInt(match[2] as string, 10) - 1,
    d: Number.parseInt(match[3] as string, 10),
  };
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function startDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function addDays(iso: string, n: number): string {
  const parsed = parseIso(iso);
  if (!parsed) return iso;
  const d = new Date(parsed.y, parsed.m, parsed.d + n);
  return toIso(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDisplayDate(iso: string): string {
  const parsed = parseIso(iso);
  if (!parsed) return iso;
  return `${MONTH_SHORT[parsed.m]} ${parsed.d}, ${parsed.y}`;
}

function todayIso(): string {
  const t = new Date();
  return toIso(t.getFullYear(), t.getMonth(), t.getDate());
}

/**
 * Date picker with calendar popup, month/year selection, and keyboard navigation.
 *
 * Features three views (days, months, years) for quick navigation, human-readable
 * date display, a "Today" shortcut, and full arrow-key navigation within the grid.
 *
 * @fires kb-change - Value changed. Detail: `{ source: 'date-picker', value: string }`.
 * @fires kb-focus - Focused.
 * @fires kb-blur - Blurred.
 * @fires kb-clear - Cleared.
 *
 * @example
 * ```html
 * <kb-date-picker value="2025-06-15" placeholder="Pick a date"></kb-date-picker>
 * ```
 */
export class KbDatePicker extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Current value in YYYY-MM-DD format. @defaultValue '' */
  @property({ type: String }) value: string = '';
  /** Placeholder text. */
  @property({ type: String }) placeholder?: string;
  /** Earliest selectable date (YYYY-MM-DD). */
  @property({ type: String }) min?: string;
  /** Latest selectable date (YYYY-MM-DD). */
  @property({ type: String }) max?: string;
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
  @state() private _view: DatePickerView = 'days';
  @state() private _viewYear: number = new Date().getFullYear();
  @state() private _viewMonth: number = new Date().getMonth();
  @state() private _focusedIso: string = '';

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
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._detachDocListeners();
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

  private _openCalendar(): void {
    if (this.disabled) return;
    this._attachDocListeners();
    const parsed = this.value ? parseIso(this.value) : null;
    if (parsed) {
      this._viewYear = parsed.y;
      this._viewMonth = parsed.m;
      this._focusedIso = this.value;
    } else {
      const now = new Date();
      this._viewYear = now.getFullYear();
      this._viewMonth = now.getMonth();
      this._focusedIso = todayIso();
    }
    this._view = 'days';
    this._open = true;
    this._animatePanel(true);
  }

  private _animatePanel(opening: boolean): void {
    requestAnimationFrame(() => {
      const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
      if (!panel) return;
      const from = opening ? { opacity: 0, transform: 'translateY(-4px)' } : { opacity: 1, transform: 'translateY(0)' };
      const to = opening ? { opacity: 1, transform: 'translateY(0)' } : { opacity: 0, transform: 'translateY(-4px)' };
      let duration: number;
      if (prefersReducedMotion()) {
        duration = 0;
      } else {
        duration = opening ? 150 : 100;
      }
      panel
        .animate([from, to], {
          duration,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          fill: 'forwards',
        })
        .finished.then(
          (a) => {
            a.commitStyles();
            a.cancel();
          },
          () => {
            /* cancelled */
          },
        );
    });
  }

  private _close(): void {
    if (!this._open) return;
    const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
    if (!panel) {
      this._finishClose();
      return;
    }
    const duration = prefersReducedMotion() ? 0 : 100;
    panel
      .animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-4px)' },
        ],
        { duration, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
      )
      .finished.then(
        () => this._finishClose(),
        () => this._finishClose(),
      );
  }

  private _finishClose(): void {
    this._open = false;
    this._view = 'days';
    this._detachDocListeners();
  }

  private _toggle(): void {
    if (this._open) {
      this._close();
    } else {
      this._openCalendar();
    }
  }

  private _prevMonth(): void {
    if (this._viewMonth === 0) {
      this._viewMonth = 11;
      this._viewYear--;
    } else {
      this._viewMonth--;
    }
  }

  private _nextMonth(): void {
    if (this._viewMonth === 11) {
      this._viewMonth = 0;
      this._viewYear++;
    } else {
      this._viewMonth++;
    }
  }

  private _isDateDisabled(iso: string): boolean {
    if (this.min && iso < this.min) return true;
    if (this.max && iso > this.max) return true;
    return false;
  }

  private _selectDate(day: CalendarDay): void {
    if (day.isDisabledRange) return;
    if (!day.isCurrentMonth) {
      this._viewYear = day.year;
      this._viewMonth = day.month;
    }
    this.value = day.iso;
    this.emit('kb-change', { source: 'date-picker', value: day.iso });
    this._close();
  }

  private _selectMonth(month: number): void {
    this._viewMonth = month;
    this._view = 'days';
  }

  private _selectYear(year: number): void {
    this._viewYear = year;
    this._view = 'months';
  }

  private _selectToday(): void {
    const today = todayIso();
    if (this._isDateDisabled(today)) return;
    this.value = today;
    this.emit('kb-change', { source: 'date-picker', value: today });
    this._close();
  }

  private _handleClear(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.value = '';
    this.emit('kb-change', { source: 'date-picker', value: '' });
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
      if (!this._open) this._openCalendar();
    }
    if (e.key === 'Escape' && this._open) {
      e.preventDefault();
      this._close();
    }
  }

  private _handleGridKeyDown(e: KeyboardEvent): void {
    if (this._view !== 'days') return;
    let next = this._focusedIso;
    if (e.key === 'ArrowRight') next = addDays(next, 1);
    else if (e.key === 'ArrowLeft') next = addDays(next, -1);
    else if (e.key === 'ArrowDown') next = addDays(next, 7);
    else if (e.key === 'ArrowUp') next = addDays(next, -7);
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (!this._isDateDisabled(this._focusedIso)) {
        this.value = this._focusedIso;
        this.emit('kb-change', { source: 'date-picker', value: this._focusedIso });
        this._close();
      }
      return;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._close();
      return;
    } else {
      return;
    }
    e.preventDefault();
    if (this._isDateDisabled(next)) return;
    this._focusedIso = next;
    const parsed = parseIso(next);
    if (parsed && (parsed.y !== this._viewYear || parsed.m !== this._viewMonth)) {
      this._viewYear = parsed.y;
      this._viewMonth = parsed.m;
    }
  }

  private _headerClick(): void {
    if (this._view === 'days') {
      this._view = 'months';
    } else if (this._view === 'months') {
      this._view = 'years';
    }
  }

  private _buildCalendarDays(): CalendarDay[] {
    const year = this._viewYear;
    const month = this._viewMonth;
    const totalDays = daysInMonth(year, month);
    const firstDow = startDayOfWeek(year, month);
    const today = todayIso();
    const days: CalendarDay[] = [];

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevDays = daysInMonth(prevYear, prevMonth);
    for (let i = firstDow - 1; i >= 0; i--) {
      const d = prevDays - i;
      const iso = toIso(prevYear, prevMonth, d);
      days.push({
        date: d,
        month: prevMonth,
        year: prevYear,
        iso,
        isCurrentMonth: false,
        isToday: iso === today,
        isSelected: iso === this.value,
        isDisabledRange: this._isDateDisabled(iso),
      });
    }

    for (let d = 1; d <= totalDays; d++) {
      const iso = toIso(year, month, d);
      days.push({
        date: d,
        month,
        year,
        iso,
        isCurrentMonth: true,
        isToday: iso === today,
        isSelected: iso === this.value,
        isDisabledRange: this._isDateDisabled(iso),
      });
    }

    const remaining = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      const iso = toIso(nextYear, nextMonth, d);
      days.push({
        date: d,
        month: nextMonth,
        year: nextYear,
        iso,
        isCurrentMonth: false,
        isToday: iso === today,
        isSelected: iso === this.value,
        isDisabledRange: this._isDateDisabled(iso),
      });
    }

    return days;
  }

  private _renderCalendarIcon(): TemplateResult {
    const iconSize = CLEAR_SIZE[this.size];
    return html`<svg class="${iconSize} shrink-0 ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect width="18" height="18" x="3" y="4" rx="0" ry="0"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>`;
  }

  private _renderChevron(direction: 'left' | 'right'): TemplateResult {
    const iconSize = NAV_ICON_SIZE[this.size];
    if (direction === 'left') {
      return html`<svg class=${iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m15 18-6-6 6-6"/></svg>`;
    }
    return html`<svg class=${iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m9 18 6-6-6-6"/></svg>`;
  }

  private _renderNavHeader(): TemplateResult {
    const s = this.size;
    const btnClasses: string = cx(
      'p-1.5 cursor-pointer select-none',
      kbClasses.textMuted,
      kbClasses.hoverTextPrimary,
      kbClasses.transitionColors,
    );
    const headerBtnClasses: string = cx(
      'cursor-pointer select-none font-medium',
      HEADER_TEXT[s],
      kbClasses.textPrimary,
      'hover:text-blue-500 dark:hover:text-blue-400',
      kbClasses.transitionColors,
    );

    let headerLabel: string;
    let onPrev: () => void;
    let onNext: () => void;

    if (this._view === 'days') {
      headerLabel = `${MONTH_NAMES[this._viewMonth]} ${this._viewYear}`;
      onPrev = (): void => this._prevMonth();
      onNext = (): void => this._nextMonth();
    } else if (this._view === 'months') {
      headerLabel = String(this._viewYear);
      onPrev = (): void => {
        this._viewYear--;
      };
      onNext = (): void => {
        this._viewYear++;
      };
    } else {
      const startYear = this._viewYear - (this._viewYear % YEARS_PER_PAGE);
      headerLabel = `${startYear} \u2013 ${startYear + YEARS_PER_PAGE - 1}`;
      onPrev = (): void => {
        this._viewYear -= YEARS_PER_PAGE;
      };
      onNext = (): void => {
        this._viewYear += YEARS_PER_PAGE;
      };
    }

    return html`
      <div class="flex items-center justify-between mb-2">
        <button type="button" class=${btnClasses} @click=${onPrev} @mousedown=${(e: Event): void => e.preventDefault()} aria-label="Previous">${this._renderChevron('left')}</button>
        <button type="button" class=${headerBtnClasses} @click=${(): void => this._headerClick()} @mousedown=${(e: Event): void => e.preventDefault()}>${headerLabel}</button>
        <button type="button" class=${btnClasses} @click=${onNext} @mousedown=${(e: Event): void => e.preventDefault()} aria-label="Next">${this._renderChevron('right')}</button>
      </div>
    `;
  }

  private _dayClasses(day: CalendarDay): string {
    const s = this.size;
    const base = cx(
      'flex items-center justify-center select-none tabular-nums',
      CELL_SIZE[s],
      CELL_TEXT[s],
      kbClasses.transitionColors,
    );

    if (day.isSelected) {
      return cx(base, 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium cursor-pointer');
    }

    if (!day.isCurrentMonth) {
      return cx(
        base,
        kbClasses.textMuted,
        day.isDisabledRange ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800',
      );
    }

    if (day.isDisabledRange) {
      return cx(base, 'opacity-30 cursor-not-allowed');
    }

    const focusRing = day.iso === this._focusedIso ? 'ring-1 ring-blue-500 dark:ring-blue-400' : '';
    const todayMark = day.isToday ? `font-semibold ${kbClasses.textPrimary}` : kbClasses.textPrimary;

    return cx(base, todayMark, focusRing, 'cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800');
  }

  private _renderDaysView(): TemplateResult {
    const days = this._buildCalendarDays();
    const s = this.size;
    const dayLabelClasses: string = cx(
      'flex items-center justify-center select-none',
      CELL_SIZE[s],
      CELL_TEXT[s],
      kbClasses.textMuted,
    );

    return html`
      <div
        class="grid grid-cols-7"
        role="grid"
        @keydown=${(e: KeyboardEvent): void => this._handleGridKeyDown(e)}
        tabindex="0"
      >
        ${DAY_LABELS.map((d: string): TemplateResult => html`<div class=${dayLabelClasses}>${d}</div>`)}
        ${days.map(
          (day: CalendarDay): TemplateResult => html`
          <div
            class=${this._dayClasses(day)}
            role="gridcell"
            aria-selected=${day.isSelected ? 'true' : 'false'}
            @click=${(): void => this._selectDate(day)}
            @mouseenter=${(): void => {
              this._focusedIso = day.iso;
            }}
          >${day.date}${day.isToday && !day.isSelected ? html`<span class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 dark:bg-blue-400" style="border-radius:9999px"></span>` : nothing}</div>
        `,
        )}
      </div>
    `;
  }

  private _renderMonthsView(): TemplateResult {
    const s = this.size;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return html`
      <div class="grid grid-cols-3 gap-1">
        ${MONTH_SHORT.map((name, i) => {
          const isCurrentMonth = i === currentMonth && this._viewYear === currentYear;
          const isSelected = this.value
            ? (() => {
                const p = parseIso(this.value);
                return p !== null && p.m === i && p.y === this._viewYear;
              })()
            : false;

          let cellClasses: string;
          if (isSelected) {
            cellClasses = cx(
              MONTH_CELL_SIZE[s],
              CELL_TEXT[s],
              'cursor-pointer select-none text-center bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium',
              kbClasses.transitionColors,
            );
          } else if (isCurrentMonth) {
            cellClasses = cx(
              MONTH_CELL_SIZE[s],
              CELL_TEXT[s],
              'cursor-pointer select-none text-center font-semibold',
              kbClasses.textPrimary,
              'hover:bg-gray-100 dark:hover:bg-zinc-800',
              kbClasses.transitionColors,
            );
          } else {
            cellClasses = cx(
              MONTH_CELL_SIZE[s],
              CELL_TEXT[s],
              'cursor-pointer select-none text-center',
              kbClasses.textPrimary,
              'hover:bg-gray-100 dark:hover:bg-zinc-800',
              kbClasses.transitionColors,
            );
          }

          return html`<button type="button" class=${cellClasses} @click=${(): void => this._selectMonth(i)} @mousedown=${(e: Event): void => e.preventDefault()}>${name}</button>`;
        })}
      </div>
    `;
  }

  private _renderYearsView(): TemplateResult {
    const s = this.size;
    const startYear = this._viewYear - (this._viewYear % YEARS_PER_PAGE);
    const now = new Date();
    const currentYear = now.getFullYear();
    const years: number[] = [];
    for (let i = 0; i < YEARS_PER_PAGE; i++) {
      years.push(startYear + i);
    }

    return html`
      <div class="grid grid-cols-3 gap-1">
        ${years.map((yr) => {
          const isCurrent = yr === currentYear;
          const isSelected = this.value
            ? (() => {
                const p = parseIso(this.value);
                return p !== null && p.y === yr;
              })()
            : false;

          let cellClasses: string;
          if (isSelected) {
            cellClasses = cx(
              MONTH_CELL_SIZE[s],
              CELL_TEXT[s],
              'cursor-pointer select-none text-center tabular-nums bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium',
              kbClasses.transitionColors,
            );
          } else if (isCurrent) {
            cellClasses = cx(
              MONTH_CELL_SIZE[s],
              CELL_TEXT[s],
              'cursor-pointer select-none text-center tabular-nums font-semibold',
              kbClasses.textPrimary,
              'hover:bg-gray-100 dark:hover:bg-zinc-800',
              kbClasses.transitionColors,
            );
          } else {
            cellClasses = cx(
              MONTH_CELL_SIZE[s],
              CELL_TEXT[s],
              'cursor-pointer select-none text-center tabular-nums',
              kbClasses.textPrimary,
              'hover:bg-gray-100 dark:hover:bg-zinc-800',
              kbClasses.transitionColors,
            );
          }

          return html`<button type="button" class=${cellClasses} @click=${(): void => this._selectYear(yr)} @mousedown=${(e: Event): void => e.preventDefault()}>${yr}</button>`;
        })}
      </div>
    `;
  }

  private _renderTodayButton(): TemplateResult {
    const todayDisabled = this._isDateDisabled(todayIso());
    const btnClasses: string = cx(
      'text-center cursor-pointer select-none pt-2 mt-1',
      CELL_TEXT[this.size],
      kbClasses.borderTop,
      todayDisabled ? 'opacity-30 cursor-not-allowed' : '',
      'text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300',
      kbClasses.transitionColors,
    );
    return html`<button type="button" class=${btnClasses} @click=${(): void => this._selectToday()} @mousedown=${(e: Event): void => e.preventDefault()}>Today</button>`;
  }

  private _renderPanel(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const panelClasses: string = cx(
      'absolute z-50 left-0 top-full mt-1 w-max max-w-[calc(100vw-2rem)]',
      kbClasses.surface,
      kbClasses.border,
      PANEL_PADDING[this.size],
    );

    let viewContent: TemplateResult;
    if (this._view === 'months') {
      viewContent = this._renderMonthsView();
    } else if (this._view === 'years') {
      viewContent = this._renderYearsView();
    } else {
      viewContent = this._renderDaysView();
    }

    return html`
      <div id=${this._panelId} class=${panelClasses} @mousedown=${(e: Event): void => e.preventDefault()}>
        ${this._renderNavHeader()}
        ${viewContent}
        ${this._view === 'days' ? this._renderTodayButton() : nothing}
      </div>
    `;
  }

  private _renderTriggerContent(hasValue: boolean, displayText: string, showClear: boolean): TemplateResult {
    const textClasses: string = cx(
      'flex-1 min-w-0 text-left truncate select-none tabular-nums',
      SIZE_TEXT[this.size],
      hasValue ? kbClasses.textPrimary : 'text-slate-400 dark:text-zinc-500',
      this.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    );

    const clearBtn: TemplateResult | typeof nothing = showClear
      ? html`<button class="${FORM_CLEAR_CLASSES}" @click=${this._handleClear} type="button" aria-label="Clear date" tabindex="-1">${this._cachedCloseIcon}</button>`
      : nothing;

    return html`
      ${this._renderCalendarIcon()}
      <span class=${textClasses}>${displayText}</span>
      ${clearBtn}
    `;
  }

  override render(): TemplateResult {
    const s = this.size;
    const isFlushed = this.variant === 'flushed';
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];
    const hasValue = this.value !== '';
    const displayText = hasValue ? formatDisplayDate(this.value) : (this.placeholder ?? '');

    const outerClasses = this.buildClasses(
      'relative flex items-stretch w-full font-sans',
      kbClasses.transitionColors,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const innerClasses: string = cx(
      'flex items-center flex-1',
      SIZE_PADDING[s],
      SIZE_GAP[s],
      isFlushed ? wrapperBorder : '',
    );

    const showClear = this.clearable && hasValue && !this.disabled;
    const expandedStr = this._open ? 'true' : 'false';
    const invalidStr = this.invalid ? 'true' : 'false';
    const disabledStr = this.disabled ? 'true' : 'false';

    return html`
      <div class=${outerClasses}>
        <div
          class=${innerClasses}
          role="combobox"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-haspopup="dialog"
          aria-expanded=${expandedStr}
          aria-controls=${this._open ? this._panelId : nothing}
          aria-invalid=${invalidStr}
          aria-disabled=${disabledStr}
          @click=${this._toggle}
          @keydown=${this._handleTriggerKeyDown}
          @focus=${this._handleTriggerFocus}
          @blur=${this._handleTriggerBlur}
        >
          ${this._renderTriggerContent(hasValue, displayText, showClear)}
        </div>
        ${this._renderPanel()}
        ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-date-picker': KbDatePicker;
  }
}
