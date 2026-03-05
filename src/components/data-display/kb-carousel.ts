import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

/** Minimum drag distance (px) to trigger a slide change. */
const SWIPE_THRESHOLD: number = 50;

/** Arrow button classes inside the control bar. */
const ARROW_BTN: string = cx(
  'shrink-0 w-11 min-h-[2.75rem] flex items-center justify-center',
  kbClasses.textPrimary,
  'hover:bg-gray-100 dark:hover:bg-zinc-800',
  kbClasses.transitionColors,
  kbClasses.focus,
);

const DOT_ACTIVE_BG: string = 'bg-slate-900 dark:bg-zinc-100';
const DOT_INACTIVE_BG: string = 'bg-gray-300 dark:bg-zinc-600';

/**
 * Content carousel/slider with horizontal sliding transitions,
 * touch/swipe support, an integrated control bar with arrow navigation,
 * dot indicators, slide counter, and optional autoplay with progress bar.
 *
 * Each direct child element becomes a slide.
 *
 * @fires kb-slide-change - Dispatched when the active slide changes, with `detail.index` and `detail.previousIndex`.
 *
 * @example
 * ```html
 * <kb-carousel autoplay loop interval="3000">
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 *   <div>Slide 3</div>
 * </kb-carousel>
 * ```
 */
export class KbCarousel extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Zero-based index of the currently visible slide. */
  @property({ type: Number }) active: number = 0;

  /** Enable automatic slide advancement. */
  @property({ type: Boolean }) autoplay: boolean = false;

  /** Autoplay interval in milliseconds. */
  @property({ type: Number }) interval: number = 5000;

  /** Wrap from last slide to first (and vice versa). */
  @property({ type: Boolean }) loop: boolean = true;

  /** Show previous/next arrow buttons in the control bar. */
  @property({ type: Boolean, attribute: 'show-arrows' }) showArrows: boolean = true;

  /** Show dot indicators in the control bar. */
  @property({ type: Boolean, attribute: 'show-dots' }) showDots: boolean = true;

  /** Show "1 / N" slide counter in the control bar. */
  @property({ type: Boolean, attribute: 'show-counter' }) showCounter: boolean = true;

  /** Pause autoplay when hovering over the carousel. */
  @property({ type: Boolean, attribute: 'pause-on-hover' }) pauseOnHover: boolean = true;

  /** Enable touch/pointer drag to swipe between slides. */
  @property({ type: Boolean }) swipeable: boolean = true;

  @state() private _hovered: boolean = false;
  @state() private _dragging: boolean = false;
  @state() private _dragDelta: number = 0;
  /** Progress fraction 0→1 for autoplay progress bar animation. */
  @state() private _autoplayProgress: number = 0;

  private _autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private _progressTimer: ReturnType<typeof setInterval> | null = null;
  private _progressStart: number = 0;
  private _dragStartX: number = 0;
  private _dragStartY: number = 0;
  private _dragLocked: boolean = false;

  private get _slideCount(): number {
    return this.defaultSlotContent.filter((n: Node): boolean => n.nodeType === Node.ELEMENT_NODE).length;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._startAutoplay();
  }

  override disconnectedCallback(): void {
    this._stopAutoplay();
    this._stopProgress();
    super.disconnectedCallback();
  }

  protected override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('autoplay') || changed.has('interval')) {
      this._restartAutoplay();
    }
  }

  // -- Navigation ----------------------------------------------------------

  /** Advance to the next slide. */
  next(): void {
    const count = this._slideCount;
    if (count === 0) return;
    const prev = this.active;
    if (this.active < count - 1) {
      this.active += 1;
    } else if (this.loop) {
      this.active = 0;
    } else {
      return;
    }
    this._emitChange(prev);
    this._restartAutoplay();
  }

  /** Go back to the previous slide. */
  prev(): void {
    const count = this._slideCount;
    if (count === 0) return;
    const prev = this.active;
    if (this.active > 0) {
      this.active -= 1;
    } else if (this.loop) {
      this.active = count - 1;
    } else {
      return;
    }
    this._emitChange(prev);
    this._restartAutoplay();
  }

  /** Jump to a specific slide index. */
  goTo(index: number): void {
    const count = this._slideCount;
    if (count === 0) return;
    const clamped = Math.max(0, Math.min(index, count - 1));
    if (clamped === this.active) return;
    const prev = this.active;
    this.active = clamped;
    this._emitChange(prev);
    this._restartAutoplay();
  }

  private _emitChange(previousIndex: number): void {
    this.emit('kb-slide-change', { index: this.active, previousIndex });
  }

  // -- Autoplay ------------------------------------------------------------

  private _startAutoplay(): void {
    if (!this.autoplay) return;
    this._stopAutoplay();
    this._startProgress();
    this._autoplayTimer = setInterval((): void => {
      if (this._hovered && this.pauseOnHover) return;
      this.next();
      this._startProgress();
    }, this.interval);
  }

  private _stopAutoplay(): void {
    if (this._autoplayTimer !== null) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
    this._stopProgress();
  }

  private _restartAutoplay(): void {
    if (this.autoplay) {
      this._startAutoplay();
    } else {
      this._stopAutoplay();
    }
  }

  // -- Progress bar --------------------------------------------------------

  private _startProgress(): void {
    this._stopProgress();
    if (prefersReducedMotion()) {
      this._autoplayProgress = 0;
      return;
    }
    this._progressStart = Date.now();
    this._autoplayProgress = 0;
    const step: number = 16;
    this._progressTimer = setInterval((): void => {
      if (this._hovered && this.pauseOnHover) return;
      const elapsed: number = Date.now() - this._progressStart;
      this._autoplayProgress = Math.min(elapsed / this.interval, 1);
    }, step);
  }

  private _stopProgress(): void {
    if (this._progressTimer !== null) {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    }
    this._autoplayProgress = 0;
  }

  // -- Pointer/touch drag --------------------------------------------------

  private _handlePointerDown(e: PointerEvent): void {
    if (!this.swipeable) return;
    if (e.button !== 0) return;
    this._dragging = true;
    this._dragLocked = false;
    this._dragStartX = e.clientX;
    this._dragStartY = e.clientY;
    this._dragDelta = 0;
    const viewport = e.currentTarget as HTMLElement;
    viewport.setPointerCapture(e.pointerId);
  }

  private _handlePointerMove(e: PointerEvent): void {
    if (!this._dragging) return;
    const dx: number = e.clientX - this._dragStartX;
    const dy: number = e.clientY - this._dragStartY;
    if (!this._dragLocked) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
        this._dragging = false;
        this._dragDelta = 0;
        return;
      }
      if (Math.abs(dx) > 5) {
        this._dragLocked = true;
        e.preventDefault();
      }
      return;
    }
    e.preventDefault();
    this._dragDelta = dx;
  }

  private _handlePointerUp(e: PointerEvent): void {
    if (!this._dragging) return;
    this._dragging = false;
    const delta = this._dragDelta;
    this._dragDelta = 0;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  // -- Event handlers ------------------------------------------------------

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.next();
    }
  }

  private _handleMouseEnter(): void {
    this._hovered = true;
  }

  private _handleMouseLeave(): void {
    this._hovered = false;
  }

  private _handleDotClick(index: number): void {
    this.goTo(index);
  }

  private _handlePrevClick(): void {
    this.prev();
  }

  private _handleNextClick(): void {
    this.next();
  }

  // -- Render helpers ------------------------------------------------------

  private _renderProgressBar(): TemplateResult | typeof nothing {
    if (!this.autoplay) return nothing;
    const widthPct: string = `${(this._autoplayProgress * 100).toFixed(1)}%`;
    return html`
      <div class="absolute bottom-0 left-0 right-0 h-0.5 z-10">
        <div
          class="h-full bg-blue-500 dark:bg-blue-400"
          style="width: ${widthPct}; transition: none"
        ></div>
      </div>
    `;
  }

  private _renderPrevArrow(): TemplateResult | typeof nothing {
    if (!this.showArrows) return nothing;
    const disabled = !this.loop && this.active === 0;
    const cls = cx(ARROW_BTN, 'border-r border-gray-200 dark:border-zinc-700', disabled ? kbClasses.disabledLook : '');
    return html`
      <button
        class=${cls}
        aria-label="Previous slide"
        ?disabled=${disabled}
        @click=${this._handlePrevClick}
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    `;
  }

  private _renderNextArrow(): TemplateResult | typeof nothing {
    if (!this.showArrows) return nothing;
    const count = this._slideCount;
    const disabled = !this.loop && this.active === count - 1;
    const cls = cx(ARROW_BTN, 'border-l border-gray-200 dark:border-zinc-700', disabled ? kbClasses.disabledLook : '');
    return html`
      <button
        class=${cls}
        aria-label="Next slide"
        ?disabled=${disabled}
        @click=${this._handleNextClick}
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    `;
  }

  private _renderDots(): TemplateResult | typeof nothing {
    if (!this.showDots) return nothing;
    const count = this._slideCount;
    if (count === 0) return nothing;

    const dots: TemplateResult[] = [];
    for (let i = 0; i < count; i++) {
      const isActive = i === this.active;
      const dotCls = cx(
        'block transition-all duration-200 ease-out',
        isActive ? `w-6 h-2 ${DOT_ACTIVE_BG}` : `w-2 h-2 ${DOT_INACTIVE_BG}`,
      );
      dots.push(html`
        <button
          class="min-w-[2.75rem] min-h-[2.75rem] flex items-center justify-center bg-transparent border-none cursor-pointer ${kbClasses.focus}"
          aria-label=${`Go to slide ${i + 1}`}
          aria-current=${isActive ? 'true' : 'false'}
          @click=${(): void => this._handleDotClick(i)}
        >
          <span class=${dotCls}></span>
        </button>
      `);
    }

    return html`
      <div class="flex items-center justify-center" role="tablist" aria-label="Slide indicators">
        ${dots}
      </div>
    `;
  }

  private _renderCounter(): TemplateResult | typeof nothing {
    if (!this.showCounter) return nothing;
    const count = this._slideCount;
    if (count === 0) return nothing;
    return html`
      <span class="shrink-0 px-3 font-sans tabular-nums text-sm ${kbClasses.textSecondary} select-none">
        ${this.active + 1} / ${count}
      </span>
    `;
  }

  private _renderControlBar(): TemplateResult | typeof nothing {
    const hasControls = this.showArrows || this.showDots || this.showCounter;
    if (!hasControls) return nothing;
    return html`
      <div class="flex items-center border-t border-gray-200 dark:border-zinc-700 ${kbClasses.surface}">
        ${this._renderPrevArrow()}
        <div class="flex-1 min-w-0 flex items-center justify-center gap-1">
          ${this._renderDots()}
          ${this._renderCounter()}
        </div>
        ${this._renderNextArrow()}
      </div>
    `;
  }

  // -- Main render ---------------------------------------------------------

  override render(): TemplateResult {
    const slides = this.defaultSlotContent.filter((n: Node): boolean => n.nodeType === Node.ELEMENT_NODE);
    const reduced = prefersReducedMotion();
    const dragOffset = this._dragging ? this._dragDelta : 0;
    const translatePct: string = `${-(this.active * 100)}%`;
    const translatePx: string = `${dragOffset}px`;
    const transition = this._dragging || reduced ? 'none' : 'transform 300ms ease-out';
    const trackStyle = `transform: translateX(calc(${translatePct} + ${translatePx})); transition: ${transition}`;

    const outerClasses = this.buildClasses(cx(kbClasses.border, 'overflow-hidden'));

    let cursorCls = '';
    if (this.swipeable) {
      cursorCls = this._dragging ? 'cursor-grabbing' : 'cursor-grab';
    }

    return html`
      <div class=${outerClasses}>
        <div
          class=${cx('relative overflow-hidden select-none', cursorCls)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Carousel"
          tabindex="0"
          @keydown=${this._handleKeydown}
          @mouseenter=${this._handleMouseEnter}
          @mouseleave=${this._handleMouseLeave}
          @pointerdown=${this._handlePointerDown}
          @pointermove=${this._handlePointerMove}
          @pointerup=${this._handlePointerUp}
          @pointercancel=${this._handlePointerUp}
        >
          <div
            class="flex"
            style=${trackStyle}
            aria-live=${this.autoplay ? 'off' : 'polite'}
          >
            ${slides.map(
              (slide: Node, i: number): TemplateResult => html`
                <div
                  class="w-full flex-shrink-0"
                  role="group"
                  aria-roledescription="slide"
                  aria-label=${`Slide ${i + 1} of ${slides.length}`}
                >
                  ${slide}
                </div>
              `,
            )}
          </div>
          ${this._renderProgressBar()}
        </div>
        ${this._renderControlBar()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-carousel': KbCarousel;
  }
}
