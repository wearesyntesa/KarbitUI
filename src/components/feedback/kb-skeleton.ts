import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

export type SkeletonVariant = 'pulse' | 'wave' | 'none';

const VARIANT_ANIMATION: Record<SkeletonVariant, string> = {
  pulse: 'animate-pulse',
  wave: 'animate-pulse',
  none: '',
} as const satisfies Record<SkeletonVariant, string>;

const SIZE_MAP: Record<ComponentSize, string> = {
  xs: 'h-3',
  sm: 'h-4',
  md: 'h-5',
  lg: 'h-6',
  xl: 'h-8',
} as const satisfies Record<ComponentSize, string>;

/**
 * Placeholder loading skeleton that mimics content shapes.
 *
 * Renders a pulsing (or static) block with configurable width, height, and variant
 * to indicate that content is loading.
 *
 * @example
 * ```html
 * <kb-skeleton width="200px" height="20px"></kb-skeleton>
 * <kb-skeleton variant="wave" circle size="lg"></kb-skeleton>
 * <kb-skeleton lines="3"></kb-skeleton>
 * ```
 */
export class KbSkeleton extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Animation variant. @defaultValue 'pulse' */
  @property({ type: String }) variant: SkeletonVariant = 'pulse';
  /** Predefined height via size token. Overridden by explicit `height` prop. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Explicit width (CSS value). @defaultValue '100%' */
  @property({ type: String }) width: string = '100%';
  /** Explicit height (CSS value). Overrides `size` when set. */
  @property({ type: String }) height?: string;
  /** Render as a circle (equal width and height). @defaultValue false */
  @property({ type: Boolean }) circle: boolean = false;
  /** Number of text-like lines to render. When > 1, ignores width/height and renders stacked bars. @defaultValue 1 */
  @property({ type: Number }) lines: number = 1;

  private _cachedAnimation = '';

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this._cachedAnimation === '' || changed.has('variant')) {
      this._cachedAnimation = VARIANT_ANIMATION[this.variant] ?? VARIANT_ANIMATION.pulse;
    }
  }

  private _renderSingleBar(w: string, h: string, isCircle: boolean): TemplateResult {
    const animation = this._cachedAnimation;
    const radiusStyle = isCircle ? 'border-radius:9999px' : '';
    const classes = this.buildClasses('bg-gray-200 dark:bg-zinc-700', animation, kbClasses.transitionColors);

    return html`<div
			class=${classes}
			style="width:${w};height:${h};${radiusStyle}"
			role="status"
			aria-label="Loading"
		></div>`;
  }

  override render(): TemplateResult {
    if (this.lines > 1) {
      const animation = this._cachedAnimation;
      const baseClasses = `bg-gray-200 dark:bg-zinc-700 ${animation} ${kbClasses.transitionColors}`;
      const lineHeight = this.height ?? SIZE_MAP[this.size] ?? SIZE_MAP.md;

      const bars: TemplateResult[] = [];
      for (let i = 0; i < this.lines; i++) {
        const isLast = i === this.lines - 1;
        const w = isLast ? '75%' : '100%';
        bars.push(html`<div class=${baseClasses} style="width:${w};height:${lineHeight}"></div>`);
      }

      const containerClasses = this.buildClasses('flex flex-col gap-2');
      return html`<div class=${containerClasses} role="status" aria-label="Loading">${bars}</div>`;
    }

    const w = this.circle ? (this.height ?? SIZE_MAP[this.size] ?? SIZE_MAP.md) : this.width;
    const h = this.height ?? SIZE_MAP[this.size] ?? SIZE_MAP.md;
    return this._renderSingleBar(w, h, this.circle);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-skeleton': KbSkeleton;
  }
}
