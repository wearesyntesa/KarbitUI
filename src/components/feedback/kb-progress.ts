import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { BG_COLOR, lookupScheme } from '../../core/color-schemes.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<ProgressSize, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
} as const satisfies Record<ProgressSize, string>;

const DEFAULT_FILL = 'bg-blue-500 dark:bg-blue-400';

const AUTO_COLOR_THRESHOLDS: ReadonlyArray<{ readonly max: number; readonly classes: string }> = [
  { max: 60, classes: 'bg-blue-500 dark:bg-blue-400' },
  { max: 85, classes: 'bg-yellow-500 dark:bg-yellow-400' },
  { max: Infinity, classes: 'bg-red-500 dark:bg-red-400' },
];

const STRIPE_BG =
  'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)';
const STRIPE_SIZE = '1rem 1rem';

/**
 * Determinate or indeterminate progress bar with structured minimal styling.
 *
 * Supports striped and animated fill patterns, visual segments,
 * auto-color thresholds, custom value labels, and a label slot.
 *
 * @slot label - Text label rendered above the progress bar.
 *
 * @example
 * ```html
 * <kb-progress value="65" show-value>
 *   <span slot="label">Uploading...</span>
 * </kb-progress>
 * <kb-progress value="90" auto-color striped animated></kb-progress>
 * <kb-progress indeterminate color-scheme="blue"></kb-progress>
 * <kb-progress value="3" max="5" segments="5" value-label="3 of 5"></kb-progress>
 * ```
 */
export class KbProgress extends KbBaseElement<'label'> {
  static override hostDisplay = 'block' as const;

  /** Current progress value between `min` and `max`. @defaultValue 0 */
  @property({ type: Number }) value: number = 0;
  /** Maximum progress value. @defaultValue 100 */
  @property({ type: Number }) max: number = 100;
  /** Minimum progress value. @defaultValue 0 */
  @property({ type: Number }) min: number = 0;
  /** Bar height preset. @defaultValue 'md' */
  @property({ type: String }) size: ProgressSize = 'md';
  /** Show an animated indeterminate (looping) fill instead of a determinate bar. @defaultValue false */
  @property({ type: Boolean }) indeterminate: boolean = false;
  /** Display the percentage or custom `valueLabel` next to the bar. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-value' }) showValue: boolean = false;
  /** Custom text displayed instead of the computed percentage when `showValue` is true. */
  @property({ type: String, attribute: 'value-label' }) valueLabel?: string;
  /** Color scheme for the fill bar. When unset, defaults to blue (or auto-color thresholds). */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Apply a diagonal stripe pattern to the fill bar. @defaultValue false */
  @property({ type: Boolean }) striped: boolean = false;
  /** Animate the stripe pattern. Requires `striped` to be true. @defaultValue false */
  @property({ type: Boolean }) animated: boolean = false;
  /** Number of visual segments dividing the track. `0` disables segmentation. @defaultValue 0 */
  @property({ type: Number }) segments: number = 0;
  /** Automatically change fill color based on value thresholds (blue → yellow → red). @defaultValue false */
  @property({ type: Boolean, attribute: 'auto-color' }) autoColor: boolean = false;

  /** Cached computed values rebuilt in `willUpdate`. */
  private _cachedPercent = 0;
  private _cachedFillColor = DEFAULT_FILL;
  private _cachedFillStyle = '';

  private _computePercent(): number {
    const range = this.max - this.min;
    if (range <= 0) return 0;
    return Math.round((Math.min(Math.max(this.value - this.min, 0), range) / range) * 100);
  }

  private _resolveFillColor(percent: number): string {
    if (this.colorScheme) {
      return lookupScheme(BG_COLOR, this.colorScheme) ?? DEFAULT_FILL;
    }
    if (this.autoColor) {
      return AUTO_COLOR_THRESHOLDS.find((t) => percent <= t.max)?.classes ?? DEFAULT_FILL;
    }
    return DEFAULT_FILL;
  }

  private _buildFillStyle(percent: number): string {
    if (this.indeterminate) return '';
    const parts = [`width:${percent}%`, `--kb-progress-scale:${percent / 100}`];
    if (this.striped) parts.push(`background-image:${STRIPE_BG}`, `background-size:${STRIPE_SIZE}`);
    return parts.join(';');
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    this._cachedPercent = this._computePercent();
    this._cachedFillColor = this._resolveFillColor(this._cachedPercent);
    this._cachedFillStyle = this._buildFillStyle(this._cachedPercent);
  }

  private _renderHeader(labelContent: Element | null, displayValue: string): TemplateResult | typeof nothing {
    if (!(labelContent || this.showValue)) return nothing;

    return html`<div class="flex items-baseline justify-between mb-1.5">
      ${labelContent ? html`<span class="${kbClasses.label} select-none">${labelContent}</span>` : html`<span></span>`}
      ${this.showValue && !this.indeterminate ? html`<span class="font-mono text-xs select-none ${kbClasses.textSecondary}">${displayValue}</span>` : nothing}
    </div>`;
  }

  private _renderSegments(): TemplateResult[] | typeof nothing {
    if (this.segments <= 1) return nothing;
    return Array.from({ length: this.segments - 1 }, (_, i): TemplateResult => {
      const pos = ((i + 1) / this.segments) * 100;
      return html`<span
        class="absolute top-0 bottom-0 w-px bg-white/30 dark:bg-zinc-900/50"
        style="left:${pos}%"
      ></span>`;
    });
  }

  override render(): TemplateResult {
    const percent = this._cachedPercent;
    const fillColor = this._cachedFillColor;
    const sizeClass = SIZE_MAP[this.size] ?? SIZE_MAP.md;

    const trackClasses = this.buildClasses(
      `w-full bg-gray-200 dark:bg-zinc-800 ${kbClasses.border} overflow-hidden relative`,
      sizeClass,
    );

    const fillClasses = cx(
      fillColor,
      'h-full origin-left',
      this.indeterminate ? 'w-1/3 animate-kb-progress-indeterminate' : 'animate-kb-progress-fill',
      this.striped && this.animated && !this.indeterminate ? 'animate-kb-progress-stripes' : '',
    );

    return html`
      ${this._renderHeader(this.slotted('label'), this.valueLabel ?? `${percent}%`)}
      <div
        class=${trackClasses}
        role="progressbar"
        aria-valuenow=${this.indeterminate ? nothing : percent}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-label=${this.indeterminate ? 'Loading' : `${percent}% complete`}
      >
        <div class=${fillClasses} style=${this._cachedFillStyle}></div>
        ${this._renderSegments()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-progress': KbProgress;
  }
}
