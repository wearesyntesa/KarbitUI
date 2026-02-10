import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  KbOverlayBase,
  BACKDROP_CLASSES, HEADER_PX, BODY_PX, FOOTER_PX,
  type OverlaySize,
} from '../../core/overlay-base.js';
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
};

const PLACEMENT_CLASSES: Record<ModalPlacement, string> = {
  center: 'items-center',
  top: 'items-start pt-16',
};

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
export class KbModal extends KbOverlayBase {
  /** Vertical positioning of the dialog within the viewport. @defaultValue 'center' */
  @property({ type: String }) placement: ModalPlacement = 'center';

  protected override get _closeLabel(): string {
    return 'Close modal';
  }

  protected override _animateDismiss(): void {
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

    this._finishDismiss(panel, DISMISS_DURATION);
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
