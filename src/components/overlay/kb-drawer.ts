import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type DrawerBackdrop = 'normal' | 'blur' | 'transparent';

const SIZE_MAP: Record<DrawerPlacement, Record<DrawerSize, string>> = {
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

const BACKDROP_CLASSES: Record<DrawerBackdrop, string> = {
  normal: 'bg-black/50',
  blur: 'bg-black/30 backdrop-blur-sm',
  transparent: 'bg-transparent',
};

const CLOSE_ICON_SIZE: Record<DrawerSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  full: 'w-6 h-6',
};

const HEADER_PX: Record<DrawerSize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
};

const BODY_PX: Record<DrawerSize, string> = {
  xs: 'px-4 py-3',
  sm: 'px-4 py-3',
  md: 'px-5 py-4',
  lg: 'px-6 py-5',
  xl: 'px-6 py-5',
  full: 'px-8 py-6',
};

const FOOTER_PX: Record<DrawerSize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
};

const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
export class KbDrawer extends KbBaseElement {
  static override hostDisplay = 'block';

  @property({ type: Boolean, reflect: true }) open: boolean = false;
  @property({ type: String }) placement: DrawerPlacement = 'right';
  @property({ type: String }) size: DrawerSize = 'md';
  @property({ type: String }) backdrop: DrawerBackdrop = 'normal';
  @property({ type: Boolean, attribute: 'close-on-overlay' }) closeOnOverlay: boolean = true;
  @property({ type: Boolean, attribute: 'close-on-escape' }) closeOnEscape: boolean = true;
  @property({ type: Boolean }) closable: boolean = true;
  @property({ type: Boolean, attribute: 'lock-scroll' }) lockScroll: boolean = true;
  @property({ type: Boolean, attribute: 'auto-focus' }) autoFocus: boolean = true;
  @property({ type: Boolean, attribute: 'trap-focus' }) trapFocus: boolean = true;

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;

  private _boundKeyHandler = this._handleKeyDown.bind(this);
  private _savedBodyOverflow: string = '';
  private _previouslyFocused: HTMLElement | null = null;
  private _dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
    document.addEventListener('keydown', this._boundKeyHandler);
    if (this.open) {
      this._show();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundKeyHandler);
    this._restoreScroll();
    if (this._dismissTimeout !== null) {
      clearTimeout(this._dismissTimeout);
      this._dismissTimeout = null;
    }
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('open')) {
      if (this.open) {
        this._show();
      } else if (changed.get('open') === true) {
        this._animateDismiss();
      }
    }
  }

  private _show(): void {
    this._dismissing = false;
    this._visible = true;
    this._lockBodyScroll();

    this._previouslyFocused = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      if (this.autoFocus) {
        this._focusFirst();
      }
      this.dispatchEvent(new CustomEvent('kb-open', { bubbles: true, composed: true }));
    });
  }

  private _animateDismiss(): void {
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

    const onFinish = (): void => {
      if (this._dismissTimeout !== null) {
        clearTimeout(this._dismissTimeout);
        this._dismissTimeout = null;
      }
      panel?.removeEventListener('transitionend', onFinish);
      this._visible = false;
      this._dismissing = false;
      this._restoreScroll();
      this._restoreFocus();
      this.dispatchEvent(new CustomEvent('kb-close', { bubbles: true, composed: true }));
    };

    panel?.addEventListener('transitionend', onFinish, { once: true });
    this._dismissTimeout = setTimeout(onFinish, DISMISS_DURATION + 50);
  }

  private _close(): void {
    this.open = false;
    if (!this._dismissing) {
      this._animateDismiss();
    }
  }

  private _lockBodyScroll(): void {
    if (!this.lockScroll) return;
    this._savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private _restoreScroll(): void {
    if (!this.lockScroll) return;
    document.body.style.overflow = this._savedBodyOverflow;
  }

  private _restoreFocus(): void {
    this._previouslyFocused?.focus();
    this._previouslyFocused = null;
  }

  private _focusFirst(): void {
    const panel = this.querySelector<HTMLElement>('[role="dialog"]');
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    first?.focus();
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (!this._visible || this._dismissing) return;

    if (this.closeOnEscape && e.key === 'Escape') {
      e.preventDefault();
      this._close();
      return;
    }

    if (this.trapFocus && e.key === 'Tab') {
      this._handleTabTrap(e);
    }
  }

  private _handleTabTrap(e: KeyboardEvent): void {
    const panel = this.querySelector<HTMLElement>('[role="dialog"]');
    if (!panel) return;

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private _handleOverlayClick(e: Event): void {
    if (this.closeOnOverlay && e.target === e.currentTarget) {
      this._close();
    }
  }

  private _renderCloseButton() {
    if (!this.closable) return nothing;

    const iconSize = CLOSE_ICON_SIZE[this.size] ?? CLOSE_ICON_SIZE.md;

    return html`
      <button
        class=${cx(
          'cursor-pointer flex-shrink-0',
          kbClasses.textSecondary,
          'hover:text-slate-900 dark:hover:text-zinc-50',
          kbClasses.transition,
          kbClasses.focus,
        )}
        @click=${this._close}
        aria-label="Close drawer"
      >
        <svg class=${iconSize} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
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
              'flex-shrink-0 flex items-center gap-3 border-t border-gray-200 dark:border-zinc-700',
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
