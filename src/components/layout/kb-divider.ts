import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { Orientation, ColorValue } from '../../core/types.js';

export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerThickness = 'thin' | 'medium' | 'thick';

const VARIANT_MAP: Record<DividerVariant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const THICKNESS_H: Record<DividerThickness, string> = {
  thin: 'border-t',
  medium: 'border-t-2',
  thick: 'border-t-4',
};

const THICKNESS_V: Record<DividerThickness, string> = {
  thin: 'border-l',
  medium: 'border-l-2',
  thick: 'border-l-4',
};

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
  static override hostDisplay = 'block';
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

  @state() private _mounted = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.animated) {
      requestAnimationFrame(() => {
        this._mounted = true;
      });
    }
  }

  override render() {
    const isHorizontal = this.orientation === 'horizontal';

    const colorClass = this.dividerColor
      ? `border-${this.dividerColor}`
      : 'border-gray-200 dark:border-zinc-700';

    const variantClass = VARIANT_MAP[this.variant];
    const thicknessClass = isHorizontal
      ? THICKNESS_H[this.thickness]
      : THICKNESS_V[this.thickness];

    const lineClasses = [variantClass, thicknessClass, colorClass].join(' ');

    if (this.label) {
      return this._renderLabeled(isHorizontal, lineClasses);
    }

    return this._renderPlain(isHorizontal, lineClasses);
  }

  private _renderPlain(isHorizontal: boolean, lineClasses: string) {
    const sizeClass = isHorizontal ? 'w-full h-0' : 'h-full w-0';

    const animationClasses = this.animated
      ? [
          'transition-transform duration-300 ease-out',
          isHorizontal ? 'origin-left' : 'origin-top',
          this._mounted
            ? (isHorizontal ? 'scale-x-100' : 'scale-y-100')
            : (isHorizontal ? 'scale-x-0' : 'scale-y-0'),
        ].join(' ')
      : '';

    const classes = this.buildClasses(sizeClass, lineClasses, animationClasses);
    return html`<div role="separator" aria-orientation=${this.orientation} class=${classes}></div>`;
  }

  private _renderLabeled(isHorizontal: boolean, lineClasses: string) {
    const containerDir = isHorizontal ? 'flex items-center' : 'flex flex-col items-center';
    const lineGrowClass = isHorizontal ? 'flex-1 h-0' : 'flex-1 w-0';

    const animationClasses = this.animated
      ? [
          'transition-opacity duration-300 ease-out',
          this._mounted ? 'opacity-100' : 'opacity-0',
        ].join(' ')
      : '';

    const containerClasses = this.buildClasses(containerDir, 'gap-3', animationClasses);

    const labelClasses = [
      'font-mono text-xs shrink-0 select-none',
      kbClasses.textSecondary,
      !isHorizontal ? '[writing-mode:vertical-rl]' : '',
    ].join(' ');

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
