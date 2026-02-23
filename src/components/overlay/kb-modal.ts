import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { prefersReducedMotion } from '../../core/base-element.js';
import { BACKDROP_CLASSES, KbOverlayBase, type OverlaySize } from '../../core/overlay-base.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

export type ModalPlacement = 'center' | 'top';

const SIZE_MAX_W: Record<OverlaySize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
} as const satisfies Record<OverlaySize, string>;

const PLACEMENT_CLASSES: Record<ModalPlacement, string> = {
  center: 'items-center',
  top: 'items-start pt-16',
} as const satisfies Record<ModalPlacement, string>;

const ANIM_DURATION_MS = 150;
const ENTER_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const EXIT_EASING = 'cubic-bezier(0.4, 0, 1, 1)';

/**
 * Centered dialog overlay with animated enter/exit, focus trapping,
 * body scroll lock, backdrop variants, and keyboard dismissal.
 *
 * @slot - Modal body content.
 * @slot header - Modal header with title.
 * @slot footer - Modal footer with actions (only renders when provided).
 *
 * @fires kb-open - Dispatched when modal finishes opening.
 * @fires kb-close - Dispatched when modal is dismissed (after exit animation).
 *
 * @example
 * ```html
 * <kb-modal open size="md" backdrop="blur">
 *   <span slot="header">CONFIRM ACTION</span>
 *   <p>Are you sure you want to proceed?</p>
 *   <span slot="footer">
 *     <kb-button variant="outline">CANCEL</kb-button>
 *     <kb-button variant="solid">CONFIRM</kb-button>
 *   </span>
 * </kb-modal>
 * ```
 */
@customElement('kb-modal')
export class KbModal extends KbOverlayBase<'header' | 'footer'> {
  /** Vertical positioning of the dialog within the viewport. @defaultValue 'center' */
  @property({ type: String }) placement: ModalPlacement = 'center';

  private _animatedIn: boolean = false;
  private _enterAnimations: Animation[] = [];
  /** Cached backdrop overlay element. Populated alongside `_panelEl` after first render. */
  private _overlayEl: HTMLElement | null = null;

  protected override get _closeLabel(): string {
    return 'Close modal';
  }

  protected override _cachePanel(): void {
    super._cachePanel();
    this._overlayEl = this.querySelector<HTMLElement>('.kb-modal-overlay');
  }

  private _stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (this._visible && !this._dismissing && !this._animatedIn) {
      this._animatedIn = true;
      this._animateEnter();
    }
  }

  private _animateEnter(): void {
    this._enterAnimations = [];
    const panel = this._panelEl;
    const overlay = this._overlayEl;
    const dur = prefersReducedMotion() ? 0 : ANIM_DURATION_MS;
    if (panel) {
      panel.classList.add('will-change-transform');
      const anim = panel.animate(
        [
          { opacity: 0, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: dur, easing: ENTER_EASING, fill: 'forwards' },
      );
      anim.finished.then(
        () => {
          anim.commitStyles();
          anim.cancel();
          panel.classList.remove('will-change-transform');
        },
        (_e: unknown) => {
          /* cancelled - no-op */
          panel.classList.remove('will-change-transform');
        },
      );
      this._enterAnimations.push(anim);
    }
    if (overlay) {
      const anim = overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: dur,
        easing: 'ease-out',
        fill: 'forwards',
      });
      anim.finished.then(
        () => {
          anim.commitStyles();
          anim.cancel();
        },
        (_e: unknown) => {
          /* cancelled - no-op */
        },
      );
      this._enterAnimations.push(anim);
    }
  }

  override disconnectedCallback(): void {
    for (const anim of this._enterAnimations) anim.cancel();
    this._enterAnimations = [];
    super.disconnectedCallback();
  }

  protected override _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    for (const a of this._enterAnimations) a.cancel();
    this._enterAnimations = [];
    this._dismissing = true;
    this._animatedIn = false;

    const panel = this._panelEl;
    const overlay = this._overlayEl;
    const dur = prefersReducedMotion() ? 0 : ANIM_DURATION_MS;

    if (panel) {
      panel.classList.add('will-change-transform');
      const anim = panel.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.95)' },
        ],
        { duration: dur, easing: EXIT_EASING, fill: 'forwards' },
      );
      anim.finished.then(
        () => {
          anim.commitStyles();
          anim.cancel();
          panel.classList.remove('will-change-transform');
          this._finishDismiss(null, 0);
        },
        () => {
          panel.classList.remove('will-change-transform');
          this._finishDismiss(null, 0);
        },
      );
    } else {
      this._finishDismiss(null, 0);
    }

    if (overlay) {
      const overlayAnim = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: dur,
        easing: 'ease-in',
        fill: 'forwards',
      });
      overlayAnim.finished.then(
        () => {
          overlayAnim.commitStyles();
          overlayAnim.cancel();
        },
        (_e: unknown) => {
          /* cancelled - no-op */
        },
      );
    }
  }

  override render(): TemplateResult {
    if (!(this._visible || this.open))
      return html`<span hidden>${this.defaultSlotContent}${this.slotted('header')}${this.slotted('footer')}</span>`;

    const s = this.size;
    const sizeClass = SIZE_MAX_W[s] ?? SIZE_MAX_W.md;
    const placementClass = PLACEMENT_CLASSES[this.placement] ?? PLACEMENT_CLASSES.center;

    const wrapperClasses = this.buildClasses('fixed inset-0 z-50 flex justify-center p-4', placementClass);
    const zStyle = this._assignedZIndex > 0 ? `z-index:${this._assignedZIndex}` : '';

    const overlayClasses = cx(
      'kb-modal-overlay fixed inset-0 z-40',
      BACKDROP_CLASSES[this.backdrop] ?? BACKDROP_CLASSES.normal,
    );

    const panelClasses = cx(
      'relative z-50 w-full flex flex-col font-sans',
      sizeClass,
      'max-h-[calc(100vh-4rem)]',
      kbClasses.surface,
      kbClasses.border,
    );
    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');

    return html`
      <div class=${overlayClasses} @click=${this._handleOverlayClick}></div>
      <div class=${wrapperClasses} style=${zStyle} @click=${this._handleOverlayClick}>
        <div
          class=${panelClasses}
          style="contain:content"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${headerEl ? this._titleId : nothing}
          aria-label=${!headerEl && this.ariaLabel ? this.ariaLabel : nothing}
          @click=${this._stopPropagation}
        >
          ${this._renderOverlayHeader(s, headerEl)}
          ${this._renderOverlayBody(s)}
          ${this._renderOverlayFooter(s, footerEl)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-modal': KbModal;
  }
}
