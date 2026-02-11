import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

const AUTO_COLOR_THRESHOLDS: Array<{ max: number; classes: string }> = [
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
@customElement('kb-progress')
export class KbProgress extends KbBaseElement<'label'> {
  static override hostDisplay = 'block' as const;

  override connectedCallback(): void {
    super.connectedCallback();
    requestAnimationFrame(() => {
      this._mounted = true;
    });
  }

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

  @state() private _mounted = false;

  private get clampedPercent(): number {
    const range = this.max - this.min;
    if (range <= 0) return 0;
    const clamped = Math.min(Math.max(this.value - this.min, 0), range);
    return Math.round((clamped / range) * 100);
  }

  private _resolveFillColor(): string {
    if (this.colorScheme) {
      return lookupScheme(BG_COLOR, this.colorScheme) ?? 'bg-blue-500 dark:bg-blue-400';
    }
    if (this.autoColor) {
      const percent = this.clampedPercent;
      const threshold = AUTO_COLOR_THRESHOLDS.find((t) => percent <= t.max);
      return threshold?.classes ?? 'bg-blue-500 dark:bg-blue-400';
    }
    return 'bg-blue-500 dark:bg-blue-400';
  }

  override render(): TemplateResult {
    const sizeClass = SIZE_MAP[this.size] ?? SIZE_MAP.md;
    const fillColor = this._resolveFillColor();
    const percent = this.clampedPercent;

    const labelContent = this.slotted('label');
    const displayValue = this.valueLabel ?? `${percent}%`;

    const trackClasses = this.buildClasses(
      `w-full bg-gray-200 dark:bg-zinc-800 ${kbClasses.border} overflow-hidden relative`,
      sizeClass,
    );

    let fillAnimationClass = '';
    if (this.indeterminate) fillAnimationClass = 'animate-kb-progress-indeterminate';
    else if (this._mounted) fillAnimationClass = 'transition-all duration-500 ease-out';

    const stripedAnimationClass =
      this.striped && this.animated && !this.indeterminate ? 'animate-kb-progress-stripes' : '';

    const fillClasses = cx(
      fillColor,
      'h-full',
      this.indeterminate ? 'w-1/3' : '',
      fillAnimationClass,
      stripedAnimationClass,
    );

    const fillStyle = this.indeterminate
      ? ''
      : [
          `width:${this._mounted ? percent : 0}%`,
          this.striped ? `background-image:${STRIPE_BG};background-size:${STRIPE_SIZE}` : '',
        ]
          .filter(Boolean)
          .join(';');

    const segmentEls =
      this.segments > 1
        ? Array.from({ length: this.segments - 1 }, (_, i) => {
            const pos = ((i + 1) / this.segments) * 100;
            return html`<span
            class="absolute top-0 bottom-0 w-px bg-white/30 dark:bg-zinc-900/50"
            style="left:${pos}%"
          ></span>`;
          })
        : nothing;

    const hasLabel = !!labelContent;
    const headerRow =
      hasLabel || this.showValue
        ? html`<div class="flex items-baseline justify-between mb-1.5">
          ${hasLabel ? html`<span class="${kbClasses.label}">${labelContent}</span>` : html`<span></span>`}
          ${
            this.showValue && !this.indeterminate
              ? html`<span class="font-mono text-xs ${kbClasses.textSecondary}">${displayValue}</span>`
              : nothing
          }
        </div>`
        : nothing;

    return html`
      ${headerRow}
      <div
        class=${trackClasses}
        role="progressbar"
        aria-valuenow=${this.indeterminate ? nothing : percent}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-label=${this.indeterminate ? 'Loading' : `${percent}% complete`}
      >
        <div class=${fillClasses} style=${fillStyle}></div>
        ${segmentEls}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-progress': KbProgress;
  }
}
