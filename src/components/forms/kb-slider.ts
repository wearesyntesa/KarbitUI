import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { BG_COLOR, lookupScheme } from '../../core/color-schemes.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const TRACK_HEIGHT: Record<ComponentSize, string> = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
  xl: 'h-2.5',
} as const satisfies Record<ComponentSize, string>;

const THUMB_SIZE: Record<ComponentSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
} as const satisfies Record<ComponentSize, string>;

const TOOLTIP_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[9px] px-1.5 py-0.5',
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-xs px-2.5 py-1',
  xl: 'text-sm px-3 py-1.5',
} as const satisfies Record<ComponentSize, string>;

const TOOLTIP_OFFSET: Record<ComponentSize, string> = {
  xs: 'bottom-[calc(100%+4px)]',
  sm: 'bottom-[calc(100%+5px)]',
  md: 'bottom-[calc(100%+6px)]',
  lg: 'bottom-[calc(100%+8px)]',
  xl: 'bottom-[calc(100%+10px)]',
} as const satisfies Record<ComponentSize, string>;

const TICK_SIZE: Record<ComponentSize, string> = {
  xs: 'w-px h-0.5',
  sm: 'w-px h-1',
  md: 'w-px h-1',
  lg: 'w-px h-1.5',
  xl: 'w-px h-1.5',
} as const satisfies Record<ComponentSize, string>;

const LABEL_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[9px]',
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-xs',
  xl: 'text-sm',
} as const satisfies Record<ComponentSize, string>;

const TOUCH_TARGET: Record<ComponentSize, string> = {
  xs: 'py-2',
  sm: 'py-2.5',
  md: 'py-3',
  lg: 'py-3',
  xl: 'py-4',
} as const satisfies Record<ComponentSize, string>;

const DEFAULT_FILL = 'bg-blue-500 dark:bg-blue-400';
const MAX_TICK_COUNT = 20;

/**
 * Range slider with draggable thumb, track click, and keyboard support.
 *
 * Features a filled accent thumb, optional value tooltip with smooth transitions,
 * optional tick marks at step intervals, and optional min/max range labels.
 *
 * @fires kb-change - Value changed. Detail: `{ source: 'slider', value: string }`.
 * @fires kb-input - Value changing during drag. Detail: `{ value: string }`.
 *
 * @example
 * ```html
 * <kb-slider value="50" min="0" max="100" show-value></kb-slider>
 * ```
 */
export class KbSlider extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Current slider value. @defaultValue 50 */
  @property({ type: Number }) value: number = 50;
  /** Minimum value. @defaultValue 0 */
  @property({ type: Number }) min: number = 0;
  /** Maximum value. @defaultValue 100 */
  @property({ type: Number }) max: number = 100;
  /** Step increment. @defaultValue 1 */
  @property({ type: Number }) step: number = 1;
  /** Slider size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Prevent value changes but allow focus. @defaultValue false */
  @property({ type: Boolean }) readonly: boolean = false;
  /** Color scheme for the filled track and thumb. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Form field name. */
  @property({ type: String }) name?: string;
  /** Show value tooltip on hover and drag. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-value' }) showValue: boolean = false;
  /** Show tick marks at step intervals (max 20 ticks). @defaultValue false */
  @property({ type: Boolean, attribute: 'show-ticks' }) showTicks: boolean = false;
  /** Show min/max labels below the track. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-range' }) showRange: boolean = false;
  /** Custom value formatter for tooltip display. */
  @property({ attribute: false }) formatValue?: (value: number) => string;

  @state() private _dragging: boolean = false;
  @state() private _hovering: boolean = false;

  private _trackEl: HTMLElement | null = null;
  private _boundMove = this._onPointerMove.bind(this);
  private _boundUp = this._onPointerUp.bind(this);

  private _isInteractive(): boolean {
    return !(this.disabled || this.readonly);
  }

  private _percent(): number {
    const range = this.max - this.min;
    if (range <= 0) return 0;
    return ((this.value - this.min) / range) * 100;
  }

  private _clamp(val: number): number {
    const stepped = Math.round((val - this.min) / this.step) * this.step + this.min;
    return Math.min(this.max, Math.max(this.min, stepped));
  }

  private _formatDisplay(val: number): string {
    if (this.formatValue) return this.formatValue(val);
    if (Number.isInteger(this.step)) return String(val);
    const decimals = String(this.step).split('.')[1]?.length ?? 0;
    return val.toFixed(decimals);
  }

  private _valueFromPointer(clientX: number): number {
    const track = this._trackEl;
    if (!track) return this.value;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return this._clamp(this.min + ratio * (this.max - this.min));
  }

  private _tickPositions(): number[] {
    const range = this.max - this.min;
    if (range <= 0 || this.step <= 0) return [];
    const count = Math.floor(range / this.step);
    if (count > MAX_TICK_COUNT || count < 2) return [];
    const positions: number[] = [];
    for (let i = 0; i <= count; i++) {
      positions.push((i / count) * 100);
    }
    return positions;
  }

  private _onTrackPointerDown(e: PointerEvent): void {
    if (!this._isInteractive()) return;
    e.preventDefault();
    this._trackEl =
      (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-kb-track]') ?? (e.currentTarget as HTMLElement);
    const newVal = this._valueFromPointer(e.clientX);
    if (newVal !== this.value) {
      this.value = newVal;
      this.emit('kb-input', { value: String(this.value) });
    }
    this._dragging = true;
    document.addEventListener('pointermove', this._boundMove);
    document.addEventListener('pointerup', this._boundUp);
  }

  private _onThumbPointerDown(e: PointerEvent): void {
    if (!this._isInteractive() || isServer) return;
    e.preventDefault();
    e.stopPropagation();
    this._dragging = true;
    this._trackEl = this.querySelector<HTMLElement>('[data-kb-track]');
    document.addEventListener('pointermove', this._boundMove);
    document.addEventListener('pointerup', this._boundUp);
  }

  private _onPointerMove(e: PointerEvent): void {
    if (!this._dragging) return;
    const newVal = this._valueFromPointer(e.clientX);
    if (newVal !== this.value) {
      this.value = newVal;
      this.emit('kb-input', { value: String(this.value) });
    }
  }

  private _onPointerUp(): void {
    if (!this._dragging) return;
    this._dragging = false;
    document.removeEventListener('pointermove', this._boundMove);
    document.removeEventListener('pointerup', this._boundUp);
    this.emit('kb-change', { source: 'slider', value: String(this.value) });
  }

  private _onKeyDown(e: KeyboardEvent): void {
    if (!this._isInteractive()) return;
    let newVal: number = this.value;
    const bigStep = this.step * 10;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      newVal = this._clamp(this.value + this.step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      newVal = this._clamp(this.value - this.step);
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      newVal = this._clamp(this.value + bigStep);
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      newVal = this._clamp(this.value - bigStep);
    } else if (e.key === 'Home') {
      e.preventDefault();
      newVal = this.min;
    } else if (e.key === 'End') {
      e.preventDefault();
      newVal = this.max;
    } else {
      return;
    }
    if (newVal !== this.value) {
      this.value = newVal;
      this.emit('kb-input', { value: String(this.value) });
      this.emit('kb-change', { source: 'slider', value: String(this.value) });
    }
  }

  private _onMouseEnter(): void {
    this._hovering = true;
  }

  private _onMouseLeave(): void {
    this._hovering = false;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (!isServer) {
      document.removeEventListener('pointermove', this._boundMove);
      document.removeEventListener('pointerup', this._boundUp);
    }
  }

  private _renderTooltip(): TemplateResult | typeof nothing {
    if (!this.showValue) return nothing;
    const visible = this._hovering || this._dragging;
    const s = this.size;
    const tooltipClasses = cx(
      'absolute left-1/2 -translate-x-1/2',
      TOOLTIP_OFFSET[s],
      TOOLTIP_TEXT[s],
      'whitespace-nowrap select-none pointer-events-none',
      'transition-[opacity,transform] duration-150 ease-in-out',
      kbClasses.surface,
      kbClasses.border,
      kbClasses.textPrimary,
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
    );
    return html`<div class=${tooltipClasses}>${this._formatDisplay(this.value)}</div>`;
  }

  private _renderTicks(): TemplateResult | typeof nothing {
    if (!this.showTicks) return nothing;
    const ticks = this._tickPositions();
    if (ticks.length === 0) return nothing;
    const s = this.size;
    const pct = this._percent();

    return html`
      <div class="absolute inset-x-0 top-full h-2">
        ${ticks.map((pos) => {
          const isFilled = pos <= pct;
          const tickClasses = cx(
            'absolute',
            TICK_SIZE[s],
            isFilled ? 'bg-gray-400 dark:bg-zinc-400' : 'bg-gray-300 dark:bg-zinc-600',
          );
          return html`<div class=${tickClasses} style="left:${pos}%"></div>`;
        })}
      </div>
    `;
  }

  private _renderRangeLabels(): TemplateResult | typeof nothing {
    if (!this.showRange) return nothing;
    const s = this.size;
    const labelClasses = cx('select-none tabular-nums', LABEL_TEXT[s], kbClasses.textMuted);
    const topOffset = this.showTicks ? 'mt-3' : 'mt-1';
    return html`
      <div class=${cx('flex justify-between', topOffset)}>
        <span class=${labelClasses}>${this._formatDisplay(this.min)}</span>
        <span class=${labelClasses}>${this._formatDisplay(this.max)}</span>
      </div>
    `;
  }

  override render(): TemplateResult {
    const s = this.size;
    const pct = this._percent();
    const fillColor = lookupScheme(BG_COLOR, this.colorScheme) ?? DEFAULT_FILL;

    const wrapperClasses = this.buildClasses(
      'relative w-full select-none',
      this.disabled ? kbClasses.disabledLook : '',
      this.readonly ? 'cursor-default' : '',
    );

    const trackAreaClasses: string = cx(
      'relative w-full',
      TOUCH_TARGET[s],
      this.disabled || this.readonly ? '' : 'cursor-pointer',
    );

    const trackClasses: string = cx('relative w-full', 'bg-gray-200 dark:bg-zinc-700', TRACK_HEIGHT[s]);

    const fillClasses: string = cx('absolute left-0 top-0 h-full', fillColor, kbClasses.transitionColors);

    const thumbClasses: string = cx(
      'absolute top-1/2',
      fillColor,
      THUMB_SIZE[s],
      kbClasses.transitionColors,
      'transition-[transform] duration-150 ease-in-out',
      this.disabled || this.readonly ? '' : 'cursor-grab',
      this._dragging ? 'cursor-grabbing scale-[1.15] z-10' : '',
      this._dragging || this.disabled || this.readonly ? '' : 'hover:scale-105',
    );

    return html`
      <div
        class=${wrapperClasses}
        role="slider"
        tabindex=${this.disabled ? '-1' : '0'}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        aria-valuetext=${this._formatDisplay(this.value)}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-readonly=${this.readonly ? 'true' : 'false'}
        @keydown=${this._onKeyDown}
        @mouseenter=${this._onMouseEnter}
        @mouseleave=${this._onMouseLeave}
        @focusin=${this._onMouseEnter}
        @focusout=${this._onMouseLeave}
      >
        <div class="relative">
          <div
            class=${trackAreaClasses}
            data-kb-track
            @pointerdown=${this._onTrackPointerDown}
          >
            <div class="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <div class=${trackClasses}>
                <div class=${fillClasses} style="width:${pct}%"></div>
              </div>
            </div>
          </div>

          <div
            class=${thumbClasses}
            style="left:${pct}%;top:50%;transform:translate(-50%,-50%)"
            @pointerdown=${this._onThumbPointerDown}
          >
            ${this._renderTooltip()}
          </div>

          ${this._renderTicks()}
        </div>

        ${this._renderRangeLabels()}

        ${this.name ? html`<input type="hidden" name=${this.name} .value=${String(this.value)} />` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-slider': KbSlider;
  }
}
