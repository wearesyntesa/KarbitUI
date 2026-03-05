import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const ICON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
} as const satisfies Record<ComponentSize, string>;

const GAP: Record<ComponentSize, string> = {
  xs: 'gap-0.5',
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1',
  xl: 'gap-1.5',
} as const satisfies Record<ComponentSize, string>;

const FILLED_COLOR = 'text-yellow-400 dark:text-yellow-400';
const EMPTY_COLOR = 'text-gray-300 dark:text-zinc-600';

/**
 * Star rating input with hover preview, half-star support, and keyboard navigation.
 *
 * @fires kb-change - Fires when the rating value changes. Detail: `{ source: 'rating', value: string }`.
 * @fires kb-rating-hover - Fires during hover with the previewed value. Detail: `{ value: number }`.
 *
 * @example
 * ```html
 * <kb-rating value="3" max="5"></kb-rating>
 * ```
 */
export class KbRating extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Current rating value. @defaultValue 0 */
  @property({ type: Number }) value: number = 0;
  /** Maximum number of stars. @defaultValue 5 */
  @property({ type: Number }) max: number = 5;
  /** Allow half-star increments. @defaultValue false */
  @property({ type: Boolean, attribute: 'allow-half' }) allowHalf: boolean = false;
  /** Display size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Read-only display (shows value but prevents changes). @defaultValue false */
  @property({ type: Boolean }) readonly: boolean = false;
  /** Form field name. */
  @property({ type: String }) name?: string;

  @state() private _hoverValue: number = 0;

  private _isInteractive(): boolean {
    return !(this.disabled || this.readonly);
  }

  private _handleStarClick(star: number, isHalf: boolean): void {
    if (!this._isInteractive()) return;
    const newValue = this.allowHalf && isHalf ? star - 0.5 : star;
    this.value = newValue;
    this.emit('kb-change', { source: 'rating', value: String(newValue) });
  }

  private _handleStarHover(star: number, isHalf: boolean): void {
    if (!this._isInteractive()) return;
    const hoverVal = this.allowHalf && isHalf ? star - 0.5 : star;
    this._hoverValue = hoverVal;
    this.emit('kb-rating-hover', { value: hoverVal });
  }

  private _handleMouseLeave(): void {
    this._hoverValue = 0;
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (!this._isInteractive()) return;
    const step = this.allowHalf ? 0.5 : 1;
    let newValue = this.value;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(this.max, this.value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.max(0, this.value - step);
        break;
      case 'Home':
        e.preventDefault();
        newValue = 0;
        break;
      case 'End':
        e.preventDefault();
        newValue = this.max;
        break;
      default:
        return;
    }

    if (newValue !== this.value) {
      this.value = newValue;
      this.emit('kb-change', { source: 'rating', value: String(newValue) });
    }
  }

  private _renderStar(index: number): TemplateResult {
    const star = index + 1;
    const displayValue = this._hoverValue > 0 ? this._hoverValue : this.value;
    const isFull = displayValue >= star;
    const isHalfFilled = !isFull && displayValue >= star - 0.5;
    const iconSize = ICON_SIZE[this.size];
    const interactive = this._isInteractive();

    const starClasses = cx(
      'relative inline-flex',
      interactive ? 'cursor-pointer' : '',
      this.disabled ? kbClasses.disabledLook : '',
    );

    return html`
      <span
        class=${starClasses}
        @click=${(): void => this._handleStarClick(star, false)}
        @mousemove=${(e: MouseEvent): void => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const isLeftHalf = e.clientX - rect.left < rect.width / 2;
          this._handleStarHover(star, isLeftHalf);
        }}
      >
        ${isHalfFilled ? this._renderHalfStar(iconSize) : nothing}
        ${
          isHalfFilled
            ? nothing
            : html`<svg class="${cx(iconSize, isFull ? FILLED_COLOR : EMPTY_COLOR, kbClasses.transitionColors)}" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>`
        }
      </span>
    `;
  }

  private _renderHalfStar(iconSize: string): TemplateResult {
    return html`
      <span class="relative inline-flex ${iconSize}">
        <svg class="${cx(iconSize, EMPTY_COLOR, 'absolute inset-0')}" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <svg class="${cx(iconSize, FILLED_COLOR, 'absolute inset-0')}" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="clip-path:inset(0 50% 0 0)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </span>
    `;
  }

  override render(): TemplateResult {
    const indices = Array.from({ length: this.max }, (_, i) => i);
    const outerClasses = this.buildClasses('inline-flex items-center', GAP[this.size]);

    return html`
      <div
        class=${outerClasses}
        role="slider"
        tabindex=${this.disabled ? '-1' : '0'}
        aria-valuenow=${this.value}
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-label="Rating"
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-readonly=${this.readonly ? 'true' : 'false'}
        @keydown=${this._handleKeyDown}
        @mouseleave=${this._handleMouseLeave}
      >
        ${indices.map((i) => this._renderStar(i))}
      </div>
      ${this.name ? html`<input type="hidden" name=${this.name} .value=${String(this.value)} />` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-rating': KbRating;
  }
}
