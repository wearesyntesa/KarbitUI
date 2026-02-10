import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize, ColorScheme } from '../../core/types.js';

type SpinnerVariant = 'border' | 'dots' | 'bars' | 'pulse';

const BORDER_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-[3px]',
};

const TRACK_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-[3px]',
};

const DOT_SIZE: Record<ComponentSize, { dot: string; gap: string }> = {
  xs: { dot: 'w-1 h-1', gap: 'gap-0.5' },
  sm: { dot: 'w-1.5 h-1.5', gap: 'gap-1' },
  md: { dot: 'w-2 h-2', gap: 'gap-1.5' },
  lg: { dot: 'w-2.5 h-2.5', gap: 'gap-2' },
  xl: { dot: 'w-3.5 h-3.5', gap: 'gap-2.5' },
};

const BAR_SIZE: Record<ComponentSize, { bar: string; height: string; gap: string }> = {
  xs: { bar: 'w-0.5', height: 'h-3', gap: 'gap-0.5' },
  sm: { bar: 'w-0.5', height: 'h-4', gap: 'gap-0.5' },
  md: { bar: 'w-1', height: 'h-6', gap: 'gap-1' },
  lg: { bar: 'w-1', height: 'h-8', gap: 'gap-1' },
  xl: { bar: 'w-1.5', height: 'h-12', gap: 'gap-1.5' },
};

const PULSE_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const SPINNER_BORDER_COLOR: Record<string, string> = {
  black: 'border-gray-900 dark:border-zinc-100',
  red: 'border-red-500 dark:border-red-400',
  blue: 'border-blue-500 dark:border-blue-400',
  green: 'border-green-500 dark:border-green-400',
  yellow: 'border-yellow-500 dark:border-yellow-400',
};

const SPINNER_BG_COLOR: Record<string, string> = {
  black: 'bg-gray-900 dark:bg-zinc-100',
  red: 'bg-red-500 dark:bg-red-400',
  blue: 'bg-blue-500 dark:bg-blue-400',
  green: 'bg-green-500 dark:bg-green-400',
  yellow: 'bg-yellow-500 dark:bg-yellow-400',
};

const TRACK_COLOR = 'border-gray-200 dark:border-zinc-700';

const LABEL_SIZE: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-sm',
};

const SPEED_DURATION: Record<string, string> = {
  slow: '1.5s',
  normal: '0.75s',
  fast: '0.45s',
};

const DOT_DELAYS = ['0s', '0.16s', '0.32s'];
const BAR_DELAYS = ['0s', '0.15s', '0.3s', '0.45s'];

/**
 * Animated loading spinner indicator.
 *
 * Supports multiple visual variants: spinning border ring, bouncing dots,
 * pulsing bars, and breathing pulse. Optional visible label and track ring.
 *
 * @example
 * ```html
 * <kb-spinner size="md"></kb-spinner>
 * <kb-spinner variant="dots" color-scheme="blue" show-label></kb-spinner>
 * <kb-spinner variant="bars" size="lg" color-scheme="red"></kb-spinner>
 * <kb-spinner variant="pulse" color-scheme="green"></kb-spinner>
 * <kb-spinner track show-label label="Loading data..."></kb-spinner>
 * ```
 */
@customElement('kb-spinner')
export class KbSpinner extends KbBaseElement {
  @property({ type: String }) variant: SpinnerVariant = 'border';
  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  @property({ type: String }) label: string = 'Loading...';
  @property({ type: Boolean, attribute: 'show-label' }) showLabel: boolean = false;
  @property({ type: String }) speed: 'slow' | 'normal' | 'fast' = 'normal';
  @property({ type: Boolean }) track: boolean = false;
  @property({ type: String, attribute: 'label-position' }) labelPosition: 'bottom' | 'right' = 'bottom';
  @property({ type: Boolean }) overlay: boolean = false;

  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  private _renderBorder() {
    const sizeClasses = BORDER_SIZE[this.size] ?? BORDER_SIZE.md;
    const borderColor = this.colorScheme
      ? SPINNER_BORDER_COLOR[this.colorScheme] ?? 'border-blue-500 dark:border-blue-400'
      : 'border-blue-500 dark:border-blue-400';

    const duration = SPEED_DURATION[this.speed] ?? SPEED_DURATION.normal;
    const spinStyle = `animation:spin ${duration} linear infinite`;

    const spinnerEl = html`<span
      class="inline-block rounded-full border-t-transparent ${sizeClasses} ${borderColor}"
      style=${spinStyle}
    ></span>`;

    if (!this.track) return spinnerEl;

    const trackSizeClasses = TRACK_SIZE[this.size] ?? TRACK_SIZE.md;
    return html`<span class="relative inline-flex items-center justify-center">
      <span class="absolute rounded-full ${trackSizeClasses} ${TRACK_COLOR}"></span>
      ${spinnerEl}
    </span>`;
  }

  private _renderDots() {
    const cfg = DOT_SIZE[this.size] ?? DOT_SIZE.md;
    const bgColor = this.colorScheme
      ? SPINNER_BG_COLOR[this.colorScheme] ?? 'bg-blue-500 dark:bg-blue-400'
      : 'bg-blue-500 dark:bg-blue-400';

    return html`<span class="inline-flex items-center ${cfg.gap}">
      ${DOT_DELAYS.map(
        (delay) => html`<span
          class="rounded-full ${cfg.dot} ${bgColor} animate-kb-spinner-bounce"
          style="animation-delay:${delay}"
        ></span>`,
      )}
    </span>`;
  }

  private _renderBars() {
    const cfg = BAR_SIZE[this.size] ?? BAR_SIZE.md;
    const bgColor = this.colorScheme
      ? SPINNER_BG_COLOR[this.colorScheme] ?? 'bg-blue-500 dark:bg-blue-400'
      : 'bg-blue-500 dark:bg-blue-400';

    return html`<span class="inline-flex items-center ${cfg.gap} ${cfg.height}">
      ${BAR_DELAYS.map(
        (delay) => html`<span
          class="${cfg.bar} h-full ${bgColor} animate-kb-spinner-bar origin-center"
          style="animation-delay:${delay}"
        ></span>`,
      )}
    </span>`;
  }

  private _renderPulse() {
    const sizeClasses = PULSE_SIZE[this.size] ?? PULSE_SIZE.md;
    const bgColor = this.colorScheme
      ? SPINNER_BG_COLOR[this.colorScheme] ?? 'bg-blue-500 dark:bg-blue-400'
      : 'bg-blue-500 dark:bg-blue-400';

    return html`<span class="inline-block rounded-full ${sizeClasses} ${bgColor} animate-kb-spinner-pulse"></span>`;
  }

  override render() {
    let spinnerEl;
    switch (this.variant) {
      case 'dots':
        spinnerEl = this._renderDots();
        break;
      case 'bars':
        spinnerEl = this._renderBars();
        break;
      case 'pulse':
        spinnerEl = this._renderPulse();
        break;
      default:
        spinnerEl = this._renderBorder();
    }

    const labelEl = this.showLabel
      ? html`<span class="font-mono ${LABEL_SIZE[this.size] ?? 'text-xs'} ${kbClasses.textSecondary} select-none">${this.label}</span>`
      : nothing;

    const layoutClass = this.labelPosition === 'right'
      ? 'inline-flex items-center gap-2'
      : 'inline-flex flex-col items-center gap-1.5';

    const wrapperClasses = this.buildClasses(layoutClass);

    const content = html`<span class=${wrapperClasses} role="status" aria-label=${this.label}>
      ${spinnerEl}
      ${labelEl}
    </span>`;

    if (!this.overlay) return content;

    return html`<span class="relative inline-flex">
      <span class="opacity-40 pointer-events-none select-none">${this.defaultSlotContent}</span>
      <span class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-zinc-900/60">
        ${content}
      </span>
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-spinner': KbSpinner;
  }
}
