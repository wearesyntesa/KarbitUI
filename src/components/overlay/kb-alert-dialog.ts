import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { prefersReducedMotion } from '../../core/base-element.js';
import { BACKDROP_CLASSES, KbOverlayBase, type OverlaySize } from '../../core/overlay-base.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

const SIZE_MAX_W: Record<OverlaySize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)]',
} as const satisfies Record<OverlaySize, string>;

const ANIM_DURATION_MS = 150;
const ENTER_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const EXIT_EASING = 'cubic-bezier(0.4, 0, 1, 1)';

/**
 * Confirmation dialog requiring an explicit action (confirm or cancel).
 *
 * Unlike `kb-modal`, the alert dialog is semantically an `alertdialog` and
 * cannot be dismissed by clicking the overlay or pressing Escape by default.
 * The user must explicitly confirm or cancel.
 *
 * @slot - Body content describing the confirmation.
 * @slot header - Dialog title.
 * @slot footer - Confirm/cancel buttons.
 *
 * @fires kb-confirm - Dispatched when the confirm action is triggered.
 * @fires kb-cancel - Dispatched when the cancel action is triggered.
 * @fires kb-open - Dispatched when dialog opens.
 * @fires kb-close - Dispatched when dialog closes (after exit animation).
 *
 * @example
 * ```html
 * <kb-alert-dialog open>
 *   <span slot="header">DELETE ITEM</span>
 *   <p>This action cannot be undone. Are you sure?</p>
 *   <span slot="footer">
 *     <kb-button variant="outline" data-action="cancel">CANCEL</kb-button>
 *     <kb-button color-scheme="red" data-action="confirm">DELETE</kb-button>
 *   </span>
 * </kb-alert-dialog>
 * ```
 */
export class KbAlertDialog extends KbOverlayBase<'header' | 'footer'> {
  /** Disable overlay click dismiss (default for alert dialogs). @defaultValue false */
  @property({ type: Boolean, attribute: 'close-on-overlay' }) override closeOnOverlay: boolean = false;
  /** Disable Escape key dismiss (default for alert dialogs). @defaultValue false */
  @property({ type: Boolean, attribute: 'close-on-escape' }) override closeOnEscape: boolean = false;
  /** Hide the close button by default for alert dialogs. @defaultValue false */
  @property({ type: Boolean }) override closable: boolean = false;

  @state() private _animatedIn: boolean = false;

  private _enterAnimations: Animation[] = [];
  private _overlayEl: HTMLElement | null = null;

  protected override get _closeLabel(): string {
    return 'Close dialog';
  }

  protected override _cachePanel(): void {
    this._panelEl = this.querySelector<HTMLElement>('[role="alertdialog"]');
    this._overlayEl = this.querySelector<HTMLElement>('.kb-alert-overlay');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this._handleActionClick);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this._handleActionClick);
    for (const anim of this._enterAnimations) anim.cancel();
    this._enterAnimations = [];
    super.disconnectedCallback();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (isServer) return;
    if (this._visible && !this._dismissing && !this._animatedIn) {
      this._animatedIn = true;
      this._animateEnter();
    }
  }

  private _handleActionClick = (e: Event): void => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'confirm') {
      this.emit('kb-confirm', { source: 'alert-dialog' as const });
      this._close();
    } else if (action === 'cancel') {
      this.emit('kb-cancel', { source: 'alert-dialog' as const });
      this._close();
    }
  };

  /** Programmatically trigger confirm. */
  confirm(): void {
    this.emit('kb-confirm', { source: 'alert-dialog' as const });
    this._close();
  }

  /** Programmatically trigger cancel. */
  cancel(): void {
    this.emit('kb-cancel', { source: 'alert-dialog' as const });
    this._close();
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
          /* cancelled */
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
          /* cancelled */
        },
      );
      this._enterAnimations.push(anim);
    }
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
          /* cancelled */
        },
      );
    }
  }

  private _stopPropagation(e: Event): void {
    e.stopPropagation();
  }

  override render(): TemplateResult {
    if (!(this._visible || this.open))
      return html`<span hidden>${this.defaultSlotContent}${this.slotted('header')}${this.slotted('footer')}</span>`;

    const s = this.size;
    const sizeClass = SIZE_MAX_W[s] ?? SIZE_MAX_W.md;
    const zStyle = this._assignedZIndex > 0 ? `z-index:${this._assignedZIndex}` : '';

    const overlayClasses = cx(
      'kb-alert-overlay fixed inset-0 z-40',
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
      <div
        class=${this.buildClasses('fixed inset-0 z-50 flex justify-center items-center p-4')}
        style=${zStyle}
        @click=${this._handleOverlayClick}
      >
        <div
          class=${panelClasses}
          style="contain:content"
          role="alertdialog"
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
    'kb-alert-dialog': KbAlertDialog;
  }
}
