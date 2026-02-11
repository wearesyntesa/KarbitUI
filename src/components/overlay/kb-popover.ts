import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { FOCUSABLE_SELECTORS, handleTabTrap } from '../../core/overlay-base.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover';
export type PopoverSize = 'xs' | 'sm' | 'md' | 'lg';

const PLACEMENT_CLASSES: Record<PopoverPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const satisfies Record<PopoverPlacement, string>;

const OFFSET_CLASSES: Record<PopoverPlacement, Record<number, string>> = {
  top: { 0: 'mb-0', 1: 'mb-1', 2: 'mb-2', 3: 'mb-3', 4: 'mb-4' },
  bottom: { 0: 'mt-0', 1: 'mt-1', 2: 'mt-2', 3: 'mt-3', 4: 'mt-4' },
  left: { 0: 'mr-0', 1: 'mr-1', 2: 'mr-2', 3: 'mr-3', 4: 'mr-4' },
  right: { 0: 'ml-0', 1: 'ml-1', 2: 'ml-2', 3: 'ml-3', 4: 'ml-4' },
};

const SIZE_MIN_W: Record<PopoverSize, string> = {
  xs: 'min-w-[160px]',
  sm: 'min-w-[200px]',
  md: 'min-w-[260px]',
  lg: 'min-w-[340px]',
} as const satisfies Record<PopoverSize, string>;

const SIZE_MAX_W: Record<PopoverSize, string> = {
  xs: 'max-w-[240px]',
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
} as const satisfies Record<PopoverSize, string>;

const HEADER_PX: Record<PopoverSize, string> = {
  xs: 'px-2.5 py-1.5',
  sm: 'px-3 py-2',
  md: 'px-3.5 py-2.5',
  lg: 'px-4 py-3',
} as const satisfies Record<PopoverSize, string>;

const BODY_PX: Record<PopoverSize, string> = {
  xs: 'px-2.5 py-2',
  sm: 'px-3 py-2.5',
  md: 'px-3.5 py-3',
  lg: 'px-4 py-3.5',
} as const satisfies Record<PopoverSize, string>;

const FOOTER_PX: Record<PopoverSize, string> = {
  xs: 'px-2.5 py-1.5',
  sm: 'px-3 py-2',
  md: 'px-3.5 py-2.5',
  lg: 'px-4 py-3',
} as const satisfies Record<PopoverSize, string>;

const BODY_TEXT: Record<PopoverSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
} as const satisfies Record<PopoverSize, string>;

const CLOSE_ICON_SIZE: Record<PopoverSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4 h-4',
} as const satisfies Record<PopoverSize, string>;

const ARROW_SURFACE = 'bg-white dark:bg-zinc-900';
const ARROW_BASE = 'absolute w-2 h-2 rotate-45';

const ARROW_CLASSES: Record<PopoverPlacement, string> = {
  bottom: `${ARROW_BASE} -top-1 left-1/2 -translate-x-1/2 ${ARROW_SURFACE} border-t border-l ${kbClasses.borderColor}`,
  top: `${ARROW_BASE} -bottom-1 left-1/2 -translate-x-1/2 ${ARROW_SURFACE} border-b border-r ${kbClasses.borderColor}`,
  right: `${ARROW_BASE} -left-1 top-1/2 -translate-y-1/2 ${ARROW_SURFACE} border-b border-l ${kbClasses.borderColor}`,
  left: `${ARROW_BASE} -right-1 top-1/2 -translate-y-1/2 ${ARROW_SURFACE} border-t border-r ${kbClasses.borderColor}`,
} as const satisfies Record<PopoverPlacement, string>;

const DISMISS_DURATION = 120;

/**
 * Interactive content popover anchored to a trigger element with animated
 * enter/exit, optional arrow, focus trapping, and hover delay support.
 *
 * @slot trigger - Element that opens the popover.
 * @slot - Popover body content.
 * @slot header - Optional popover header.
 * @slot footer - Optional popover footer (only renders when provided).
 *
 * @fires kb-open - Dispatched when popover opens.
 * @fires kb-close - Dispatched when popover closes (after exit animation).
 *
 * @example
 * ```html
 * <kb-popover placement="bottom" size="md" show-arrow>
 *   <kb-button slot="trigger">OPTIONS</kb-button>
 *   <span slot="header">SETTINGS</span>
 *   <p>Popover content here.</p>
 *   <span slot="footer"><kb-button size="xs">Apply</kb-button></span>
 * </kb-popover>
 * ```
 */
@customElement('kb-popover')
export class KbPopover extends KbBaseElement<'trigger' | 'header' | 'footer'> {
  /** Position of the popover relative to the trigger element. @defaultValue 'bottom' */
  @property({ type: String }) placement: PopoverPlacement = 'bottom';
  /** How the popover is activated — `'click'` toggles on click, `'hover'` on mouse enter/leave. @defaultValue 'click' */
  @property({ type: String }) trigger: PopoverTrigger = 'click';
  /** Popover panel width and padding size. @defaultValue 'sm' */
  @property({ type: String }) size: PopoverSize = 'sm';
  /** Programmatically control visibility. Reflected to attribute. @defaultValue false */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Close the popover when the Escape key is pressed. @defaultValue true */
  @property({ type: Boolean, attribute: 'close-on-escape' }) closeOnEscape: boolean = true;
  /** Close the popover when clicking outside of it. @defaultValue true */
  @property({ type: Boolean, attribute: 'close-on-outside' }) closeOnOutside: boolean = true;
  /** Show a close button in the header area. @defaultValue false */
  @property({ type: Boolean }) closable: boolean = false;
  /** Render a small arrow pointing toward the trigger element. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-arrow' }) showArrow: boolean = false;
  /** Distance between the popover and the trigger (0–4 Tailwind spacing units). @defaultValue 2 */
  @property({ type: Number }) offset: number = 2;
  /** Delay in ms before showing the popover on hover trigger. @defaultValue 0 */
  @property({ type: Number, attribute: 'open-delay' }) openDelay: number = 0;
  /** Delay in ms before hiding the popover after mouse leaves (hover trigger). @defaultValue 150 */
  @property({ type: Number, attribute: 'close-delay' }) closeDelay: number = 150;
  /** Automatically focus the first focusable element inside the popover when opened. @defaultValue false */
  @property({ type: Boolean, attribute: 'auto-focus' }) autoFocus: boolean = false;
  /** Trap keyboard focus within the popover while open. @defaultValue false */
  @property({ type: Boolean, attribute: 'trap-focus' }) trapFocus: boolean = false;

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;

  private _boundKeyHandler = this._handleKeyDown.bind(this);
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _previouslyFocused: HTMLElement | null = null;
  private _dismissTimeout: ReturnType<typeof setTimeout> | null = null;
  private _openTimerId: ReturnType<typeof setTimeout> | null = null;
  private _closeTimerId: ReturnType<typeof setTimeout> | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._boundKeyHandler);
    document.addEventListener('click', this._boundOutsideClick, true);
    if (this.open) {
      this._show();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundKeyHandler);
    document.removeEventListener('click', this._boundOutsideClick, true);
    this._clearTimers();
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

  private _clearTimers(): void {
    if (this._openTimerId !== null) {
      clearTimeout(this._openTimerId);
      this._openTimerId = null;
    }
    if (this._closeTimerId !== null) {
      clearTimeout(this._closeTimerId);
      this._closeTimerId = null;
    }
    if (this._dismissTimeout !== null) {
      clearTimeout(this._dismissTimeout);
      this._dismissTimeout = null;
    }
  }

  private _show(): void {
    this._clearTimers();
    this._dismissing = false;
    this._visible = true;

    this._previouslyFocused = document.activeElement as HTMLElement | null;

    requestAnimationFrame(() => {
      if (this.autoFocus) {
        this._focusFirst();
      }
      this.emit('kb-open');
    });
  }

  private _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const panel = this.querySelector<HTMLElement>('[role="dialog"]');

    if (panel) {
      panel.style.transition = `transform ${DISMISS_DURATION}ms ease-in, opacity ${DISMISS_DURATION}ms ease-in`;
      panel.style.transform = 'scale(0.95)';
      panel.style.opacity = '0';
    }

    const onFinish = (): void => {
      if (this._dismissTimeout !== null) {
        clearTimeout(this._dismissTimeout);
        this._dismissTimeout = null;
      }
      panel?.removeEventListener('transitionend', onFinish);
      this._visible = false;
      this._dismissing = false;
      this._restoreFocus();
      this.emit('kb-close');
    };

    panel?.addEventListener('transitionend', onFinish, { once: true });
    this._dismissTimeout = setTimeout(onFinish, DISMISS_DURATION + 50);
  }

  private _openPopover(): void {
    if (this.open) return;
    this.open = true;
  }

  private _close(): void {
    if (!(this.open || this._visible)) return;
    this.open = false;
    if (!this._dismissing) {
      this._animateDismiss();
    }
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
    handleTabTrap(panel, e);
  }

  private _handleOutsideClick(e: MouseEvent): void {
    if (!(this._visible && this.closeOnOutside) || this._dismissing) return;
    if (!this.contains(e.target as Node)) {
      this._close();
    }
  }

  private _handleTriggerClick(): void {
    if (this.trigger !== 'click') return;
    if (this.open || this._visible) {
      this._close();
    } else {
      this._openPopover();
    }
  }

  private _handleMouseEnter(): void {
    if (this.trigger !== 'hover') return;

    if (this._closeTimerId !== null) {
      clearTimeout(this._closeTimerId);
      this._closeTimerId = null;
    }

    if (this.open || this._visible) return;

    const delay = this.openDelay;
    if (delay > 0) {
      this._openTimerId = setTimeout(() => {
        this._openTimerId = null;
        this._openPopover();
      }, delay);
    } else {
      this._openPopover();
    }
  }

  private _handleMouseLeave(): void {
    if (this.trigger !== 'hover') return;

    if (this._openTimerId !== null) {
      clearTimeout(this._openTimerId);
      this._openTimerId = null;
    }

    if (!(this.open || this._visible)) return;

    const delay = this.closeDelay;
    if (delay > 0) {
      this._closeTimerId = setTimeout(() => {
        this._closeTimerId = null;
        this._close();
      }, delay);
    } else {
      this._close();
    }
  }

  private _renderCloseButton(): TemplateResult | typeof nothing {
    if (!this.closable) return nothing;

    const iconSize = CLOSE_ICON_SIZE[this.size] ?? CLOSE_ICON_SIZE.sm;

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
        aria-label="Close popover"
      >
        <svg class=${iconSize} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
  }

  override render(): TemplateResult {
    const wrapperClasses = this.buildClasses('relative inline-block');

    const triggerEl = this.slotted('trigger');

    const p = this.placement;
    const s = this.size;

    const basePlacement = PLACEMENT_CLASSES[p] ?? PLACEMENT_CLASSES.bottom;
    const offsetVal = Math.max(0, Math.min(4, this.offset));
    const offsetClass = OFFSET_CLASSES[p]?.[offsetVal] ?? '';

    const panelClasses = cx(
      'absolute z-50',
      basePlacement.replace(/m[trbl]-\d+/g, ''),
      offsetClass,
      SIZE_MIN_W[s],
      SIZE_MAX_W[s],
      kbClasses.surface,
      kbClasses.border,
      'font-sans',
      !this._dismissing && 'animate-kb-scale-in',
    );

    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');
    const arrowClasses = ARROW_CLASSES[p] ?? ARROW_CLASSES.bottom;

    return html`
      <span
        class=${wrapperClasses}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <span
          @click=${this._handleTriggerClick}
          aria-haspopup="dialog"
          aria-expanded=${this._visible ? 'true' : 'false'}
        >
          ${triggerEl}
        </span>
        ${
          this._visible || this.open
            ? html`
            <div class=${panelClasses} role="dialog">
              ${this.showArrow ? html`<div class=${arrowClasses}></div>` : nothing}
              ${
                headerEl || this.closable
                  ? html`
                  <div class=${cx('flex items-center justify-between', HEADER_PX[s], kbClasses.borderBottom)}>
                    ${headerEl ? html`<div class=${kbClasses.label}>${headerEl}</div>` : html`<div></div>`}
                    ${this._renderCloseButton()}
                  </div>`
                  : nothing
              }
              <div class=${cx(BODY_TEXT[s], BODY_PX[s], kbClasses.textPrimary)}>
                ${this.defaultSlotContent}
              </div>
              ${
                footerEl
                  ? html`
                  <div class=${cx(`flex items-center gap-2 border-t ${kbClasses.borderColor}`, FOOTER_PX[s])}>
                    ${footerEl}
                  </div>`
                  : nothing
              }
            </div>`
            : nothing
        }
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-popover': KbPopover;
  }
}
