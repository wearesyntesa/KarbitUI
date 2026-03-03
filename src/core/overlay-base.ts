import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { cx } from '../utils/cx.js';
import { KbBaseElement } from './base-element.js';
import { kbClasses } from './theme.js';

import type { ComponentSize } from './types.js';

let _overlayIdCounter = 0;
let _zIndexCounter = 0;
const Z_BASE = 50;

export type OverlaySize = ComponentSize | 'full';
export type OverlayBackdrop = 'normal' | 'blur' | 'transparent';

export const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function handleTabTrap(container: HTMLElement, e: KeyboardEvent): void {
  if (isServer) return;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
  if (focusable.length === 0) return;

  const first = focusable[0] as HTMLElement;
  const last = focusable[focusable.length - 1] as HTMLElement;

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export const BACKDROP_CLASSES: Record<OverlayBackdrop, string> = {
  normal: 'bg-black/50',
  blur: 'bg-black/30 backdrop-blur-sm',
  transparent: 'bg-transparent',
} as const satisfies Record<OverlayBackdrop, string>;

export const CLOSE_ICON_SIZE: Record<OverlaySize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  full: 'w-6 h-6',
} as const satisfies Record<OverlaySize, string>;

export const HEADER_PX: Record<OverlaySize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
} as const satisfies Record<OverlaySize, string>;

export const BODY_PX: Record<OverlaySize, string> = {
  xs: 'px-4 py-3',
  sm: 'px-4 py-3',
  md: 'px-5 py-4',
  lg: 'px-6 py-5',
  xl: 'px-6 py-5',
  full: 'px-8 py-6',
} as const satisfies Record<OverlaySize, string>;

export const FOOTER_PX: Record<OverlaySize, string> = {
  xs: 'px-4 py-2.5',
  sm: 'px-4 py-3',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
  xl: 'px-6 py-4',
  full: 'px-8 py-5',
} as const satisfies Record<OverlaySize, string>;

/**
 * Abstract base for full-screen overlay components (modal, drawer).
 *
 * Provides open/close lifecycle, body scroll lock, focus trapping,
 * keyboard dismissal, overlay click dismissal, and close button rendering.
 * Subclasses must implement `_animateDismiss()`, `_closeLabel`, and `render()`.
 */
export abstract class KbOverlayBase<S extends string = string> extends KbBaseElement<S> {
  static override hostDisplay = 'block' as const;

  private static _scrollLockCount: number = 0;
  private static _scrollbarWidth: number = 0;

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
  /**
   * Accessible label for the dialog when no visible header is provided.
   * Used as `aria-label` on the `role="dialog"` element.
   * When a header slot is present, `aria-labelledby` is used automatically instead.
   */
  @property({ type: String, attribute: 'aria-label' }) override ariaLabel: string | null = null;

  @state() protected _visible: boolean = false;
  @state() protected _dismissing: boolean = false;

  protected readonly _titleId: string = `kb-overlay-title-${++_overlayIdCounter}`;

  private _boundKeyHandler = this._handleKeyDown.bind(this);
  private _previouslyFocused: HTMLElement | null = null;
  private _inertedElements: Element[] = [];
  protected _assignedZIndex: number = 0;
  protected _dismissTimeout: ReturnType<typeof setTimeout> | null = null;
  /** Cached reference to the `[role="dialog"]` panel element. Populated after first render. */
  protected _panelEl: HTMLElement | null = null;
  /** Guards against `_finishDismiss` being invoked twice (transitionend + setTimeout race). */
  private _dismissFinished: boolean = false;

  protected abstract _animateDismiss(): void;
  protected abstract get _closeLabel(): string;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.open) {
      this._show();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (!isServer) {
      document.removeEventListener('keydown', this._boundKeyHandler);
    }
    this._restoreScroll();
    if (this._dismissTimeout !== null) {
      clearTimeout(this._dismissTimeout);
      this._dismissTimeout = null;
    }
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (this._visible && !this._panelEl) {
      this._cachePanel();
    }
    if (changed.has('open')) {
      if (this.open) {
        this._show();
      } else if (changed.get('open') === true) {
        this._animateDismiss();
      }
    }
  }

  /** Caches the `[role="dialog"]` element after it has been rendered into the light DOM. */
  protected _cachePanel(): void {
    this._panelEl = this.querySelector<HTMLElement>('[role="dialog"]');
  }

  /** Programmatically open the overlay. Equivalent to setting `open = true`. */
  show(): void {
    this.open = true;
  }

  /** Programmatically close the overlay with dismiss animation. */
  close(): void {
    this._close();
  }

  protected _show(): void {
    if (this._visible) return;
    this._dismissing = false;
    this._visible = true;
    this._assignedZIndex = Z_BASE + ++_zIndexCounter;

    if (!isServer) {
      document.addEventListener('keydown', this._boundKeyHandler);
      this._previouslyFocused = document.activeElement as HTMLElement | null;
    }

    this._applyInert();

    if (isServer) {
      this.emit('kb-open');
    } else {
      requestAnimationFrame(() => {
        this._lockBodyScroll();
        if (this.autoFocus) {
          this._focusFirst();
        }
        this.emit('kb-open');
      });
    }
  }

  protected _close(): void {
    this.open = false;
    if (!this._dismissing) {
      this._animateDismiss();
    }
  }

  private _lockBodyScroll(): void {
    if (isServer || !this.lockScroll) return;
    if (++KbOverlayBase._scrollLockCount === 1) {
      KbOverlayBase._scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (KbOverlayBase._scrollbarWidth > 0) {
        document.body.style.paddingRight = `${KbOverlayBase._scrollbarWidth}px`;
      }
    }
  }

  protected _restoreScroll(): void {
    if (isServer || !this.lockScroll) return;
    if (KbOverlayBase._scrollLockCount > 0 && --KbOverlayBase._scrollLockCount === 0) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      KbOverlayBase._scrollbarWidth = 0;
    }
  }

  private _applyInert(): void {
    const siblings = this.parentElement?.children;
    if (!siblings) return;
    for (const sibling of Array.from(siblings)) {
      if (sibling === this) continue;
      const el = sibling as HTMLElement;
      // Skip siblings already inerted by a previously opened overlay (P-15).
      if (el.inert) continue;
      el.inert = true;
      this._inertedElements.push(sibling);
    }
  }

  protected _restoreFocus(): void {
    for (const el of this._inertedElements) {
      (el as HTMLElement).inert = false;
    }
    this._inertedElements = [];
    this._previouslyFocused?.focus();
    this._previouslyFocused = null;
  }

  protected _focusFirst(): void {
    const panel = this._panelEl ?? this.querySelector<HTMLElement>('[role="dialog"]');
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
    const panel = this._panelEl ?? this.querySelector<HTMLElement>('[role="dialog"]');
    if (!panel) return;
    handleTabTrap(panel, e);
  }

  protected _handleOverlayClick(e: Event): void {
    if (this.closeOnOverlay && e.target === e.currentTarget) {
      this._close();
    }
  }

  /** Awaits the CSS transition on `panel` (with a `durationMs + 50 ms` fallback timeout), then resets overlay state and emits `kb-close`. Subclasses call this after starting their exit transition. */
  protected _finishDismiss(panel: HTMLElement | null, durationMs: number): void {
    if (isServer) return;
    this._dismissFinished = false;
    const onFinish = (): void => {
      if (this._dismissFinished) return;
      this._dismissFinished = true;
      if (this._dismissTimeout !== null) {
        clearTimeout(this._dismissTimeout);
        this._dismissTimeout = null;
      }
      panel?.removeEventListener('transitionend', onFinish);
      document.removeEventListener('keydown', this._boundKeyHandler);
      this._visible = false;
      this._dismissing = false;
      this._panelEl = null;
      if (_zIndexCounter > 0) --_zIndexCounter;
      this._assignedZIndex = 0;
      this._restoreScroll();
      this._restoreFocus();
      this.emit('kb-close');
    };
    panel?.addEventListener('transitionend', onFinish, { once: true });
    this._dismissTimeout = setTimeout(onFinish, durationMs + 50);
  }

  protected _renderCloseButton(): TemplateResult | typeof nothing {
    if (!this.closable) return nothing;

    const iconSize = CLOSE_ICON_SIZE[this.size] ?? CLOSE_ICON_SIZE.md;

    return html`
      <button
        class=${cx(
          'cursor-pointer flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center select-none',
          kbClasses.textSecondary,
          kbClasses.hoverTextPrimary,
          kbClasses.transitionColors,
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

  protected _renderOverlayHeader(s: OverlaySize, headerEl: Element | null): TemplateResult | typeof nothing {
    if (!(headerEl || this.closable)) return nothing;
    return html`
      <div class=${cx('flex items-center justify-between flex-shrink-0', HEADER_PX[s], kbClasses.borderBottom)}>
        ${headerEl ? html`<div id=${this._titleId} class="text-sm font-semibold uppercase tracking-widest ${kbClasses.textPrimary} select-none">${headerEl}</div>` : html`<div></div>`}
        ${this._renderCloseButton()}
      </div>`;
  }

  protected _renderOverlayBody(s: OverlaySize): TemplateResult {
    return html`
      <div class=${cx('flex-1 overflow-y-auto', BODY_PX[s], kbClasses.textPrimary)}>
        ${this.defaultSlotContent}
      </div>`;
  }

  protected _renderOverlayFooter(s: OverlaySize, footerEl: Element | null): TemplateResult | typeof nothing {
    if (!footerEl) return nothing;
    return html`
      <div class=${cx(
        `flex-shrink-0 flex items-center justify-end gap-3 border-t ${kbClasses.borderColor}`,
        FOOTER_PX[s],
      )}>
        ${footerEl}
      </div>`;
  }
}
