import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorValue, Orientation } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerThickness = 'thin' | 'medium' | 'thick';

const VARIANT_MAP: Record<DividerVariant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
} as const satisfies Record<DividerVariant, string>;

const THICKNESS_H: Record<DividerThickness, string> = {
  thin: 'border-t',
  medium: 'border-t-2',
  thick: 'border-t-4',
} as const satisfies Record<DividerThickness, string>;

const THICKNESS_V: Record<DividerThickness, string> = {
  thin: 'border-l',
  medium: 'border-l-2',
  thick: 'border-l-4',
} as const satisfies Record<DividerThickness, string>;

/**
 * Visual separator between content sections.
 *
 * Supports border style variants, thickness levels, and an optional label
 * rendered inline (e.g. "OR", "Continue"). Set `animated` to reveal with a
 * scale-in transition on mount.
 *
 * @example
 * ```html
 * <kb-divider />
 * <kb-divider variant="dashed" thickness="medium" />
 * <kb-divider label="OR" />
 * <kb-divider orientation="vertical" animated />
 * ```
 */
@customElement('kb-divider')
export class KbDivider extends KbBaseElement {
  static override hostDisplay = 'block' as const;
  /** Divider axis. `'horizontal'` draws a top border, `'vertical'` a left border. @defaultValue 'horizontal' */
  @property({ type: String }) orientation: Orientation = 'horizontal';
  /** Custom border color as a Tailwind color value (e.g. `'blue-500'`). Falls back to theme border. */
  @property({ type: String, attribute: 'divider-color' }) dividerColor?: ColorValue;
  /** Border style variant. @defaultValue 'solid' */
  @property({ type: String }) variant: DividerVariant = 'solid';
  /** Border thickness level. @defaultValue 'thin' */
  @property({ type: String }) thickness: DividerThickness = 'thin';
  /** Optional inline label text (e.g. `'OR'`). When set, the divider renders as two lines flanking the label. */
  @property({ type: String }) label: string = '';
  /** Animate in with a scale/opacity transition on mount. @defaultValue false */
  @property({ type: Boolean }) animated: boolean = false;

  private _mounted = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.animated) {
      requestAnimationFrame(() => {
        this._mounted = true;
        this.requestUpdate();
      });
    }
  }

  override render(): TemplateResult {
    const isHorizontal = this.orientation === 'horizontal';

    const colorClass = this.dividerColor ? `border-${this.dividerColor}` : kbClasses.borderColor;

    const variantClass = VARIANT_MAP[this.variant];
    const thicknessClass = isHorizontal ? THICKNESS_H[this.thickness] : THICKNESS_V[this.thickness];

    const lineClasses = cx(variantClass, thicknessClass, colorClass);

    if (this.label) {
      return this._renderLabeled(isHorizontal, lineClasses);
    }

    return this._renderPlain(isHorizontal, lineClasses);
  }

  private _renderPlain(isHorizontal: boolean, lineClasses: string): TemplateResult {
    const sizeClass = isHorizontal ? 'w-full h-0' : 'h-full w-0';

    let scaleClass: string;
    if (this._mounted) scaleClass = isHorizontal ? 'scale-x-100' : 'scale-y-100';
    else scaleClass = isHorizontal ? 'scale-x-0' : 'scale-y-0';

    const animationClasses = this.animated
      ? cx(
          'transition-transform ease-out',
          prefersReducedMotion() ? 'duration-0' : 'duration-300',
          isHorizontal ? 'origin-left' : 'origin-top',
          scaleClass,
        )
      : '';

    const classes = this.buildClasses(sizeClass, lineClasses, animationClasses);
    return html`<div role="separator" aria-orientation=${this.orientation} class=${classes}></div>`;
  }

  private _renderLabeled(isHorizontal: boolean, lineClasses: string): TemplateResult {
    const containerDir = isHorizontal ? 'flex items-center' : 'flex flex-col items-center';
    const lineGrowClass = isHorizontal ? 'flex-1 h-0' : 'flex-1 w-0';

    const animationClasses = this.animated
      ? cx(
          'transition-opacity ease-out',
          prefersReducedMotion() ? 'duration-0' : 'duration-300',
          this._mounted ? 'opacity-100' : 'opacity-0',
        )
      : '';

    const containerClasses = this.buildClasses(containerDir, 'gap-3', animationClasses);

    const labelClasses = cx(
      'font-mono text-xs shrink-0 select-none',
      kbClasses.textSecondary,
      isHorizontal ? '' : '[writing-mode:vertical-rl]',
    );

    return html`
      <div role="separator" aria-orientation=${this.orientation} aria-label=${this.label || nothing} class=${containerClasses}>
        <div class="${lineGrowClass} ${lineClasses}"></div>
        <span class=${labelClasses}>${this.label}</span>
        <div class="${lineGrowClass} ${lineClasses}"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-divider': KbDivider;
  }
}
