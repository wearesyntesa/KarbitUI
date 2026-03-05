import { html, isServer, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

export type HoverCardPlacement = 'top' | 'bottom';
export type HoverCardSize = 'sm' | 'md' | 'lg';

const PLACEMENT_CLASSES: Record<HoverCardPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
} as const satisfies Record<HoverCardPlacement, string>;

const SIZE_MAX_W: Record<HoverCardSize, string> = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-96',
} as const satisfies Record<HoverCardSize, string>;

const ENTER_ANIMATION: Record<HoverCardPlacement, string> = {
  top: 'animate-kb-pop-top',
  bottom: 'animate-kb-pop-bottom',
} as const satisfies Record<HoverCardPlacement, string>;

const EXIT_TRANSLATE: Record<HoverCardPlacement, string> = {
  top: 'translateY(4px)',
  bottom: 'translateY(-4px)',
} as const satisfies Record<HoverCardPlacement, string>;

const DISMISS_DURATION = 120;

let hoverCardIdCounter: number = 0;

/**
 * Card that appears on hover over a trigger element, useful for
 * previewing content without clicking.
 *
 * @slot - Trigger element that activates the card on hover.
 * @slot content - Card body content.
 *
 * @fires kb-open - Dispatched when card becomes visible.
 * @fires kb-close - Dispatched when card is hidden.
 *
 * @example
 * ```html
 * <kb-hover-card>
 *   <a href="/user/elena">@elena</a>
 *   <div slot="content">
 *     <p>Elena Vasquez — Senior Engineer</p>
 *     <p>12 contributions this week</p>
 *   </div>
 * </kb-hover-card>
 * ```
 */
export class KbHoverCard extends KbBaseElement<'content'> {
  /** Position of the card relative to the trigger. @defaultValue 'bottom' */
  @property({ type: String }) placement: HoverCardPlacement = 'bottom';
  /** Card width preset. @defaultValue 'md' */
  @property({ type: String }) size: HoverCardSize = 'md';
  /** Delay in ms before showing the card. @defaultValue 300 */
  @property({ type: Number, attribute: 'open-delay' }) openDelay: number = 300;
  /** Delay in ms before hiding the card. @defaultValue 200 */
  @property({ type: Number, attribute: 'close-delay' }) closeDelay: number = 200;
  /** Programmatically control visibility. @defaultValue false */
  @property({ type: Boolean, reflect: true }) open: boolean = false;

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;

  private _openTimerId: ReturnType<typeof setTimeout> | null = null;
  private _closeTimerId: ReturnType<typeof setTimeout> | null = null;
  private _exitAnimation: Animation | null = null;
  private readonly _cardId = `kb-hover-card-${++hoverCardIdCounter}`;
  private _panelEl: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    if (isServer) return;
    if (this.open) {
      this._show();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (isServer) return;
    this._clearTimers();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (isServer) return;
    if (changed.has('open')) {
      if (this.open) {
        this._show();
      } else if (changed.get('open') === true) {
        this._animateDismiss();
      }
    }
    if (this._visible && !this._panelEl) {
      this._panelEl = this.querySelector<HTMLElement>(`#${this._cardId}`);
    }
    if (!this._visible) {
      this._panelEl = null;
    }
  }

  private _clearTimers(): void {
    if (this._openTimerId !== null) {
      clearTimeout(this._openTimerId);
      this._openTimerId = null;
    }
    if (this._closeTimerId !== null) {
      clearTimeout(this._closeTimerId);
      this._closeTimerId = null;
    }
    if (this._exitAnimation !== null) {
      this._exitAnimation.cancel();
      this._exitAnimation = null;
    }
  }

  private _show(): void {
    this._clearTimers();
    this._dismissing = false;
    this._visible = true;
    this.emit('kb-open');
  }

  private _hide(): void {
    if (!(this._visible || this.open)) return;
    this.open = false;
    if (!this._dismissing) {
      this._animateDismiss();
    }
  }

  private _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const panel = this._panelEl ?? this.querySelector<HTMLElement>(`#${this._cardId}`);

    const onFinish = (): void => {
      this._exitAnimation = null;
      this._visible = false;
      this._dismissing = false;
      this._panelEl = null;
      this.emit('kb-close');
    };

    if (panel) {
      const exitTranslate = EXIT_TRANSLATE[this.placement] ?? EXIT_TRANSLATE.bottom;
      const anim = panel.animate(
        [
          { transform: 'translateX(-50%) translateY(0)', opacity: 1 },
          { transform: `translateX(-50%) ${exitTranslate}`, opacity: 0 },
        ],
        {
          duration: prefersReducedMotion() ? 0 : DISMISS_DURATION,
          easing: 'ease-in',
          fill: 'forwards',
        },
      );
      this._exitAnimation = anim;
      anim.finished.then(() => {
        anim.commitStyles();
        anim.cancel();
        onFinish();
      }, onFinish);
    } else {
      onFinish();
    }
  }

  private _handleMouseEnter(): void {
    if (this._closeTimerId !== null) {
      clearTimeout(this._closeTimerId);
      this._closeTimerId = null;
    }
    if (this._visible || this.open) return;

    const delay = this.openDelay;
    if (delay > 0) {
      this._openTimerId = setTimeout(() => {
        this._openTimerId = null;
        this._show();
      }, delay);
    } else {
      this._show();
    }
  }

  private _handleMouseLeave(): void {
    if (this._openTimerId !== null) {
      clearTimeout(this._openTimerId);
      this._openTimerId = null;
    }
    if (!(this._visible || this.open)) return;

    const delay = this.closeDelay;
    if (delay > 0) {
      this._closeTimerId = setTimeout(() => {
        this._closeTimerId = null;
        this._hide();
      }, delay);
    } else {
      this._hide();
    }
  }

  override render(): TemplateResult {
    const p = this.placement;
    const s = this.size;
    const wrapperClasses = this.buildClasses('relative inline-block');
    const contentEl = this.slotted('content');

    const panelClasses = cx(
      'absolute z-50',
      PLACEMENT_CLASSES[p],
      SIZE_MAX_W[s],
      kbClasses.surface,
      kbClasses.border,
      'p-3 font-sans',
      !this._dismissing && ENTER_ANIMATION[p],
    );

    return html`
      <span
        class=${wrapperClasses}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <span>${this.defaultSlotContent}</span>
        ${
          this._visible || this.open
            ? html`<div id=${this._cardId} class=${panelClasses} style="contain:content">
              ${contentEl}
            </div>`
            : html`<span hidden>${contentEl}</span>`
        }
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-hover-card': KbHoverCard;
  }
}
