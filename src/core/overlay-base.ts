import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from './base-element.js';
import { kbClasses } from './theme.js';
import { cx } from '../utils/cx.js';

export type OverlaySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type OverlayBackdrop = 'normal' | 'blur' | 'transparent';

export const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const BACKDROP_CLASSES: Record<OverlayBackdrop, string> = {
  normal: 'bg-black/50',
  blur: 'bg-black/30 backdrop-blur-sm',
  transparent: 'bg-transparent',
};

export const CLOSE_ICON_SIZE: Record<OverlaySize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  full: 'w-6 h-6',
};

export const HEADER_PX: Record<OverlaySize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
};

export const BODY_PX: Record<OverlaySize, string> = {
  xs: 'px-4 py-3',
  sm: 'px-4 py-3',
  md: 'px-5 py-4',
  lg: 'px-6 py-5',
  xl: 'px-6 py-5',
  full: 'px-8 py-6',
};

export const FOOTER_PX: Record<OverlaySize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
};

/**
 * Abstract base for full-screen overlay components (modal, drawer).
 *
 * Provides open/close lifecycle, body scroll lock, focus trapping,
 * keyboard dismissal, overlay click dismissal, and close button rendering.
 * Subclasses must implement `_animateDismiss()`, `_closeLabel`, and `render()`.
 */
export abstract class KbOverlayBase extends KbBaseElement {
  static override hostDisplay = 'block';

  /** Whether the overlay is open. Reflects to the `open` attribute. @defaultValue false */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Panel size preset controlling width (modal) or width/height (drawer). @defaultValue 'md' */
  @property({ type: String }) size: OverlaySize = 'md';
  /** Backdrop style behind the overlay panel. @defaultValue 'normal' */
  @property({ type: String }) backdrop: OverlayBackdrop = 'normal';
  /** Close when clicking the backdrop area outside the panel. @defaultValue true */
  @property({ type: Boolean, attribute: 'close-on-overlay' }) closeOnOverlay: boolean = true;
  /** Close when the Escape key is pressed. @defaultValue true */
  @property({ type: Boolean, attribute: 'close-on-escape' }) closeOnEscape: boolean = true;
  /** Show the built-in close button in the header. @defaultValue true */
  @property({ type: Boolean }) closable: boolean = true;
  /** Prevent body scrolling while the overlay is open. @defaultValue true */
  @property({ type: Boolean, attribute: 'lock-scroll' }) lockScroll: boolean = true;
  /** Move focus to the first focusable element inside the panel on open. @defaultValue true */
  @property({ type: Boolean, attribute: 'auto-focus' }) autoFocus: boolean = true;
  /** Trap Tab/Shift+Tab focus cycling within the overlay panel. @defaultValue true */
  @property({ type: Boolean, attribute: 'trap-focus' }) trapFocus: boolean = true;

  @state() protected _visible: boolean = false;
  @state() protected _dismissing: boolean = false;

  private _boundKeyHandler = this._handleKeyDown.bind(this);
  private _savedBodyOverflow: string = '';
  private _previouslyFocused: HTMLElement | null = null;
  protected _dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  protected abstract _animateDismiss(): void;
  protected abstract get _closeLabel(): string;

  override connectedCallback(): void {
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

  protected _show(): void {
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

  protected _close(): void {
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

  protected _restoreScroll(): void {
    if (!this.lockScroll) return;
    document.body.style.overflow = this._savedBodyOverflow;
  }

  protected _restoreFocus(): void {
    this._previouslyFocused?.focus();
    this._previouslyFocused = null;
  }

  protected _focusFirst(): void {
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

  protected _handleOverlayClick(e: Event): void {
    if (this.closeOnOverlay && e.target === e.currentTarget) {
      this._close();
    }
  }

  /** Wire up transitionend + fallback timeout, then clean up overlay state and dispatch kb-close. */
  protected _finishDismiss(panel: HTMLElement | null, durationMs: number): void {
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
    this._dismissTimeout = setTimeout(onFinish, durationMs + 50);
  }

  protected _renderCloseButton() {
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
        aria-label=${this._closeLabel}
      >
        <svg class=${iconSize} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
  }
}
