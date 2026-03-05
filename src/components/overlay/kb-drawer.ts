import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { prefersReducedMotion } from '../../core/base-element.js';
import { BACKDROP_CLASSES, KbOverlayBase, type OverlaySize } from '../../core/overlay-base.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

const SIZE_MAP: Record<DrawerPlacement, Record<OverlaySize, string>> = {
  left: {
    xs: 'w-60 max-w-full',
    sm: 'w-72 max-w-full',
    md: 'w-96 max-w-full',
    lg: 'w-[32rem] max-w-full',
    xl: 'w-[40rem] max-w-full',
    full: 'w-full',
  },
  right: {
    xs: 'w-60 max-w-full',
    sm: 'w-72 max-w-full',
    md: 'w-96 max-w-full',
    lg: 'w-[32rem] max-w-full',
    xl: 'w-[40rem] max-w-full',
    full: 'w-full',
  },
  top: { xs: 'h-40', sm: 'h-52', md: 'h-72', lg: 'h-96', xl: 'h-[32rem]', full: 'h-full' },
  bottom: { xs: 'h-40', sm: 'h-52', md: 'h-72', lg: 'h-96', xl: 'h-[32rem]', full: 'h-full' },
} as const satisfies Record<DrawerPlacement, Record<OverlaySize, string>>;

const PLACEMENT_CLASSES: Record<DrawerPlacement, string> = {
  left: 'inset-y-0 left-0',
  right: 'inset-y-0 right-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
} as const satisfies Record<DrawerPlacement, string>;

const SLIDE_ENTER: Record<DrawerPlacement, Keyframe[]> = {
  left: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
  right: [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }],
  top: [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }],
  bottom: [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
} as const;

const SLIDE_EXIT: Record<DrawerPlacement, Keyframe[]> = {
  left: [{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }],
  right: [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
  top: [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
  bottom: [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }],
} as const;

const ANIM_DURATION_MS = 200;
const ENTER_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const EXIT_EASING = 'cubic-bezier(0.4, 0, 1, 1)';

/**
 * Slide-out panel overlay from any edge of the viewport with animated
 * enter/exit, focus trapping, body scroll lock, and backdrop variants.
 *
 * @slot - Drawer body content.
 * @slot header - Drawer header content.
 * @slot footer - Drawer footer content (only renders when provided).
 *
 * @fires kb-open - Dispatched when drawer finishes opening.
 * @fires kb-close - Dispatched when drawer is dismissed (after exit animation).
 *
 * @example
 * ```html
 * <kb-drawer open placement="right" size="md" backdrop="blur">
 *   <span slot="header">NAVIGATION</span>
 *   <nav>...</nav>
 *   <span slot="footer"><kb-button size="sm">Close</kb-button></span>
 * </kb-drawer>
 * ```
 */
export class KbDrawer extends KbOverlayBase<'header' | 'footer'> {
  /** Edge of the viewport from which the drawer slides in. @defaultValue 'right' */
  @property({ type: String }) placement: DrawerPlacement = 'right';

  private _animatedIn: boolean = false;
  private _enterAnimations: Animation[] = [];
  /** Cached backdrop overlay element. Populated alongside `_panelEl` after first render. */
  private _overlayEl: HTMLElement | null = null;

  protected override get _closeLabel(): string {
    return 'Close drawer';
  }

  protected override _cachePanel(): void {
    super._cachePanel();
    this._overlayEl = this.querySelector<HTMLElement>('.kb-drawer-overlay');
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (isServer) return;
    if (this._visible && !this._dismissing && !this._animatedIn) {
      this._animatedIn = true;
      this._animateEnter();
    }
  }

  private _animateEnter(): void {
    this._enterAnimations = [];
    const panel = this._panelEl;
    const overlay = this._overlayEl;
    const p = this.placement;
    const dur = prefersReducedMotion() ? 0 : ANIM_DURATION_MS;
    if (panel) {
      panel.classList.add('will-change-transform');
      const anim = panel.animate(SLIDE_ENTER[p] ?? SLIDE_ENTER.right, {
        duration: dur,
        easing: ENTER_EASING,
        fill: 'forwards',
      });
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
    if (isServer) return;
  }

  protected override _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    for (const a of this._enterAnimations) a.cancel();
    this._enterAnimations = [];
    this._dismissing = true;
    this._animatedIn = false;

    const panel = this._panelEl;
    const overlay = this._overlayEl;
    const p = this.placement;
    const dur = prefersReducedMotion() ? 0 : ANIM_DURATION_MS;

    if (panel) {
      panel.classList.add('will-change-transform');
      const anim = panel.animate(SLIDE_EXIT[p] ?? SLIDE_EXIT.right, {
        duration: dur,
        easing: EXIT_EASING,
        fill: 'forwards',
      });
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

    const p = this.placement;
    const s = this.size;
    const placementClass = PLACEMENT_CLASSES[p] ?? PLACEMENT_CLASSES.right;
    const sizeClass = SIZE_MAP[p]?.[s] ?? SIZE_MAP.right.md;

    const overlayClasses = this.buildClasses(
      'kb-drawer-overlay fixed inset-0 z-50',
      BACKDROP_CLASSES[this.backdrop] ?? BACKDROP_CLASSES.normal,
    );

    const panelClasses = cx(
      'fixed z-50 flex flex-col font-sans',
      placementClass,
      sizeClass,
      kbClasses.surface,
      kbClasses.border,
    );
    const zStyle = this._assignedZIndex > 0 ? `z-index:${this._assignedZIndex}` : '';

    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');

    return html`
      <div class=${overlayClasses} @click=${this._handleOverlayClick}></div>
      <div
          class=${panelClasses}
          style="contain:content${zStyle ? `;${zStyle}` : ''}"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${headerEl ? this._titleId : nothing}
          aria-label=${!headerEl && this.ariaLabel ? this.ariaLabel : nothing}
        >
        ${this._renderOverlayHeader(s, headerEl)}
        ${this._renderOverlayBody(s)}
        ${this._renderOverlayFooter(s, footerEl)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-drawer': KbDrawer;
  }
}
