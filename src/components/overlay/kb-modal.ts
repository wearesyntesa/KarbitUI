import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPlacement = 'center' | 'top';
type ModalBackdrop = 'normal' | 'blur' | 'transparent';

const SIZE_MAX_W: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

const HEADER_PX: Record<ModalSize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
};

const BODY_PX: Record<ModalSize, string> = {
  xs: 'px-4 py-3',
  sm: 'px-4 py-3',
  md: 'px-5 py-4',
  lg: 'px-6 py-5',
  xl: 'px-6 py-5',
  full: 'px-8 py-6',
};

const FOOTER_PX: Record<ModalSize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
};

const CLOSE_ICON_SIZE: Record<ModalSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  full: 'w-6 h-6',
};

const BACKDROP_CLASSES: Record<ModalBackdrop, string> = {
  normal: 'bg-black/50',
  blur: 'bg-black/30 backdrop-blur-sm',
  transparent: 'bg-transparent',
};

const PLACEMENT_CLASSES: Record<ModalPlacement, string> = {
  center: 'items-center',
  top: 'items-start pt-16',
};

const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DISMISS_DURATION = 150;

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
export class KbModal extends KbBaseElement {
  static override hostDisplay = 'block';

  @property({ type: Boolean, reflect: true }) open: boolean = false;
  @property({ type: String }) size: ModalSize = 'md';
  @property({ type: String }) placement: ModalPlacement = 'center';
  @property({ type: String }) backdrop: ModalBackdrop = 'normal';
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
    const overlay = panel?.parentElement?.querySelector<HTMLElement>('.kb-modal-overlay');

    if (panel) {
      panel.style.transition = `transform ${DISMISS_DURATION}ms ease-in, opacity ${DISMISS_DURATION}ms ease-in`;
      panel.style.transform = 'scale(0.95)';
      panel.style.opacity = '0';
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
        aria-label="Close modal"
      >
        <svg class=${iconSize} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
  }

  override render() {
    if (!this._visible && !this.open) return nothing;

    const s = this.size;
    const sizeClass = SIZE_MAX_W[s] ?? SIZE_MAX_W.md;
    const placementClass = PLACEMENT_CLASSES[this.placement] ?? PLACEMENT_CLASSES.center;

    const wrapperClasses = this.buildClasses(
      'fixed inset-0 z-50 flex justify-center p-4',
      placementClass,
    );

    const overlayClasses = cx(
      'kb-modal-overlay fixed inset-0 z-40',
      BACKDROP_CLASSES[this.backdrop] ?? BACKDROP_CLASSES.normal,
      !this._dismissing && 'animate-kb-fade-in',
    );

    const panelClasses = cx(
      'relative z-50 w-full flex flex-col font-sans',
      sizeClass,
      'max-h-[calc(100vh-4rem)]',
      kbClasses.surface,
      kbClasses.border,
      !this._dismissing && 'animate-kb-scale-in',
    );

    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');

    return html`
      <div class=${overlayClasses} @click=${this._handleOverlayClick}></div>
      <div class=${wrapperClasses} @click=${this._handleOverlayClick}>
        <div class=${panelClasses} role="dialog" aria-modal="true" @click=${(e: Event) => e.stopPropagation()}>
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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-modal': KbModal;
  }
}
