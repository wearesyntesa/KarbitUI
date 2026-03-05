import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const SIZE_MAP: Record<ComponentSize, { wh: string; svgSize: number; stroke: number; labelSize: string }> = {
  xs: { wh: 'w-8 h-8', svgSize: 32, stroke: 3, labelSize: 'text-[8px]' },
  sm: { wh: 'w-12 h-12', svgSize: 48, stroke: 3.5, labelSize: 'text-[10px]' },
  md: { wh: 'w-16 h-16', svgSize: 64, stroke: 4, labelSize: 'text-xs' },
  lg: { wh: 'w-20 h-20', svgSize: 80, stroke: 4.5, labelSize: 'text-sm' },
  xl: { wh: 'w-24 h-24', svgSize: 96, stroke: 5, labelSize: 'text-base' },
} as const satisfies Record<ComponentSize, { wh: string; svgSize: number; stroke: number; labelSize: string }>;

const STROKE_MAP: Partial<Record<ColorScheme, string>> = {
  blue: 'stroke-blue-500 dark:stroke-blue-400',
  green: 'stroke-green-500 dark:stroke-green-400',
  red: 'stroke-red-500 dark:stroke-red-400',
  yellow: 'stroke-yellow-500 dark:stroke-yellow-400',
  orange: 'stroke-orange-500 dark:stroke-orange-400',
  purple: 'stroke-purple-500 dark:stroke-purple-400',
  pink: 'stroke-pink-500 dark:stroke-pink-400',
  gray: 'stroke-gray-500 dark:stroke-zinc-400',
};

const DEFAULT_STROKE = 'stroke-blue-500 dark:stroke-blue-400';
const TRACK_STROKE = 'stroke-gray-200 dark:stroke-zinc-700';

/**
 * Circular / ring progress indicator with SVG rendering.
 *
 * Supports determinate and indeterminate modes, size presets,
 * color schemes, optional value label, and thickness control.
 *
 * @slot - Optional label content rendered inside the ring.
 *
 * @example
 * ```html
 * <kb-circular-progress value="75" show-value></kb-circular-progress>
 * <kb-circular-progress indeterminate color-scheme="green" size="lg"></kb-circular-progress>
 * ```
 */
export class KbCircularProgress extends KbBaseElement {
  /** Current progress value between `min` and `max`. @defaultValue 0 */
  @property({ type: Number }) value: number = 0;
  /** Maximum progress value. @defaultValue 100 */
  @property({ type: Number }) max: number = 100;
  /** Minimum progress value. @defaultValue 0 */
  @property({ type: Number }) min: number = 0;
  /** Size preset. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Show animated indeterminate spinner. @defaultValue false */
  @property({ type: Boolean }) indeterminate: boolean = false;
  /** Show percentage label inside the ring. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-value' }) showValue: boolean = false;
  /** Custom label text instead of computed percentage. */
  @property({ type: String, attribute: 'value-label' }) valueLabel?: string;
  /** Color scheme for the progress arc. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Ring thickness multiplier. @defaultValue 1 */
  @property({ type: Number }) thickness: number = 1;

  private _cachedPercent: number = 0;

  private _computePercent(): number {
    const range = this.max - this.min;
    if (range <= 0) return 0;
    return Math.round((Math.min(Math.max(this.value - this.min, 0), range) / range) * 100);
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    this._cachedPercent = this._computePercent();
  }

  private _getStrokeColor(): string {
    if (this.colorScheme) {
      return STROKE_MAP[this.colorScheme] ?? DEFAULT_STROKE;
    }
    return DEFAULT_STROKE;
  }

  override render(): TemplateResult {
    const sizeConfig = SIZE_MAP[this.size] ?? SIZE_MAP.md;
    const svgSize = sizeConfig.svgSize;
    const strokeWidth = sizeConfig.stroke * this.thickness;
    const radius = (svgSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = this._cachedPercent;
    const offset = circumference - (percent / 100) * circumference;
    const strokeColor = this._getStrokeColor();

    const wrapperClasses = this.buildClasses('relative inline-flex items-center justify-center', sizeConfig.wh);
    const displayValue = this.valueLabel ?? `${percent}%`;

    return html`
      <div
        class=${wrapperClasses}
        role="progressbar"
        aria-valuenow=${this.indeterminate ? nothing : percent}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-label=${this.indeterminate ? 'Loading' : `${percent}% complete`}
      >
        <svg
          class=${cx(sizeConfig.wh, this.indeterminate ? 'animate-spin' : '')}
          viewBox="0 0 ${svgSize} ${svgSize}"
          fill="none"
          style="transform:rotate(-90deg)"
        >
          <circle
            class=${TRACK_STROKE}
            cx=${svgSize / 2}
            cy=${svgSize / 2}
            r=${radius}
            stroke-width=${strokeWidth}
            fill="none"
          />
          <circle
            class=${cx(strokeColor, 'transition-[stroke-dashoffset] duration-300 ease-out')}
            cx=${svgSize / 2}
            cy=${svgSize / 2}
            r=${radius}
            stroke-width=${strokeWidth}
            fill="none"
            stroke-linecap="square"
            stroke-dasharray=${circumference}
            stroke-dashoffset=${this.indeterminate ? circumference * 0.75 : offset}
          />
        </svg>
        ${
          this.showValue && !this.indeterminate
            ? html`<span class=${cx(
                'absolute font-mono select-none',
                sizeConfig.labelSize,
                kbClasses.textPrimary,
              )}>${displayValue}</span>`
            : nothing
        }
        ${this.defaultSlotContent}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-circular-progress': KbCircularProgress;
  }
}
