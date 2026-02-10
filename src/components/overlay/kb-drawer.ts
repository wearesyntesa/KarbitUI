import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  KbOverlayBase,
  BACKDROP_CLASSES, HEADER_PX, BODY_PX, FOOTER_PX,
  type OverlaySize,
} from '../../core/overlay-base.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

const SIZE_MAP: Record<DrawerPlacement, Record<OverlaySize, string>> = {
  left: { xs: 'w-60', sm: 'w-72', md: 'w-96', lg: 'w-[32rem]', xl: 'w-[40rem]', full: 'w-full' },
  right: { xs: 'w-60', sm: 'w-72', md: 'w-96', lg: 'w-[32rem]', xl: 'w-[40rem]', full: 'w-full' },
  top: { xs: 'h-40', sm: 'h-52', md: 'h-72', lg: 'h-96', xl: 'h-[32rem]', full: 'h-full' },
  bottom: { xs: 'h-40', sm: 'h-52', md: 'h-72', lg: 'h-96', xl: 'h-[32rem]', full: 'h-full' },
};

const PLACEMENT_CLASSES: Record<DrawerPlacement, string> = {
  left: 'inset-y-0 left-0',
  right: 'inset-y-0 right-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0',
};

const SLIDE_IN_ANIM: Record<DrawerPlacement, string> = {
  left: 'animate-kb-slide-in-left',
  right: 'animate-kb-slide-in-right',
  top: 'animate-kb-slide-in-down',
  bottom: 'animate-kb-slide-in-up',
};

const SLIDE_OUT_TRANSFORM: Record<DrawerPlacement, string> = {
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
  top: 'translateY(-100%)',
  bottom: 'translateY(100%)',
};

const DISMISS_DURATION = 200;

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
@customElement('kb-drawer')
export class KbDrawer extends KbOverlayBase {
  /** Edge of the viewport from which the drawer slides in. @defaultValue 'right' */
  @property({ type: String }) placement: DrawerPlacement = 'right';

  protected override get _closeLabel(): string {
    return 'Close drawer';
  }

  protected override _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const panel = this.querySelector<HTMLElement>('[role="dialog"]');
    const overlay = panel?.previousElementSibling as HTMLElement | null;

    if (panel) {
      panel.style.transition = `transform ${DISMISS_DURATION}ms ease-in, opacity ${DISMISS_DURATION}ms ease-in`;
      panel.style.transform = SLIDE_OUT_TRANSFORM[this.placement] ?? SLIDE_OUT_TRANSFORM.right;
    }

    if (overlay) {
      overlay.style.transition = `opacity ${DISMISS_DURATION}ms ease-in`;
      overlay.style.opacity = '0';
    }

    this._finishDismiss(panel, DISMISS_DURATION);
  }

  override render() {
    if (!this._visible && !this.open) return nothing;

    const p = this.placement;
    const s = this.size;
    const placementClass = PLACEMENT_CLASSES[p] ?? PLACEMENT_CLASSES.right;
    const sizeClass = SIZE_MAP[p]?.[s] ?? SIZE_MAP.right.md;
    const slideAnim = this._dismissing ? '' : (SLIDE_IN_ANIM[p] ?? SLIDE_IN_ANIM.right);

    const overlayClasses = this.buildClasses(
      'fixed inset-0 z-50',
      BACKDROP_CLASSES[this.backdrop] ?? BACKDROP_CLASSES.normal,
      !this._dismissing && 'animate-kb-fade-in',
    );

    const panelClasses = cx(
      'fixed z-50 flex flex-col font-sans',
      placementClass,
      sizeClass,
      kbClasses.surface,
      kbClasses.border,
      slideAnim,
    );

    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');

    return html`
      <div class=${overlayClasses} @click=${this._handleOverlayClick}></div>
      <div class=${panelClasses} role="dialog" aria-modal="true">
        ${headerEl || this.closable
          ? html`
            <div class=${cx(
              'flex items-center justify-between flex-shrink-0',
              HEADER_PX[s],
              kbClasses.borderBottom,
            )}>
              ${headerEl
                ? html`<div class=${kbClasses.label}>${headerEl}</div>`
                : html`<div></div>`}
              ${this._renderCloseButton()}
            </div>`
          : nothing}
        <div class=${cx(
          'flex-1 overflow-y-auto',
          BODY_PX[s],
          kbClasses.textPrimary,
        )}>
          ${this.defaultSlotContent}
        </div>
        ${footerEl
          ? html`
            <div class=${cx(
              'flex-shrink-0 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-zinc-700',
              FOOTER_PX[s],
            )}>
              ${footerEl}
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-drawer': KbDrawer;
  }
}
