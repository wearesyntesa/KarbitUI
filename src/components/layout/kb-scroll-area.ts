import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';

export type ScrollbarVisibility = 'auto' | 'always' | 'hover' | 'never';
export type ScrollDirection = 'vertical' | 'horizontal' | 'both';

const OVERFLOW_MAP: Record<ScrollDirection, string> = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
} as const satisfies Record<ScrollDirection, string>;

const SCROLLBAR_VISIBILITY: Record<ScrollbarVisibility, string> = {
  auto: '',
  always: 'scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-500 scrollbar-track-transparent',
  hover:
    'scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-zinc-500 scrollbar-track-transparent',
  never: 'scrollbar-none',
} as const satisfies Record<ScrollbarVisibility, string>;

/**
 * Custom scrollbar container with configurable overflow direction,
 * scrollbar visibility, and optional max height/width constraints.
 *
 * @slot - Scrollable content.
 *
 * @fires kb-scroll - Dispatched on scroll with current scroll position.
 *
 * @example
 * ```html
 * <kb-scroll-area style="max-height:300px" scrollbar="hover">
 *   <div>Long content...</div>
 * </kb-scroll-area>
 * ```
 */
export class KbScrollArea extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Scroll direction. @defaultValue 'vertical' */
  @property({ type: String }) direction: ScrollDirection = 'vertical';
  /** Scrollbar visibility mode. @defaultValue 'auto' */
  @property({ type: String }) scrollbar: ScrollbarVisibility = 'auto';
  /** Apply a thin border around the scroll container. @defaultValue false */
  @property({ type: Boolean }) bordered: boolean = false;

  private _handleScroll(e: Event): void {
    const target = e.target as HTMLElement;
    this.emit('kb-scroll', {
      scrollTop: target.scrollTop,
      scrollLeft: target.scrollLeft,
    });
  }

  override render(): TemplateResult {
    const overflowClasses = OVERFLOW_MAP[this.direction] ?? OVERFLOW_MAP.vertical;
    const scrollbarClasses = SCROLLBAR_VISIBILITY[this.scrollbar] ?? '';

    const classes = this.buildClasses(
      'relative w-full h-full',
      overflowClasses,
      scrollbarClasses,
      this.bordered ? kbClasses.border : '',
    );

    return html`
      <div class=${classes} @scroll=${this._handleScroll}>
        ${this.defaultSlotContent}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-scroll-area': KbScrollArea;
  }
}
