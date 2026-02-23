import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { FOCUSABLE_SELECTORS, handleTabTrap } from '../../core/overlay-base.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover';
export type PopoverSize = 'xs' | 'sm' | 'md' | 'lg';

const PLACEMENT_BASE: Record<PopoverPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2',
  bottom: 'top-full left-1/2 -translate-x-1/2',
  left: 'right-full top-1/2 -translate-y-1/2',
  right: 'left-full top-1/2 -translate-y-1/2',
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

const ARROW_BASE = 'absolute w-2 h-2 rotate-45';

const ARROW_CLASSES: Record<PopoverPlacement, string> = {
  bottom: `${ARROW_BASE} -top-1 left-1/2 -translate-x-1/2 ${kbClasses.surface} border-t border-l ${kbClasses.borderColor}`,
  top: `${ARROW_BASE} -bottom-1 left-1/2 -translate-x-1/2 ${kbClasses.surface} border-b border-r ${kbClasses.borderColor}`,
  right: `${ARROW_BASE} -left-1 top-1/2 -translate-y-1/2 ${kbClasses.surface} border-b border-l ${kbClasses.borderColor}`,
  left: `${ARROW_BASE} -right-1 top-1/2 -translate-y-1/2 ${kbClasses.surface} border-t border-r ${kbClasses.borderColor}`,
} as const satisfies Record<PopoverPlacement, string>;

const DISMISS_DURATION = 100;

let _popoverIdCounter = 0;

const ENTER_ANIMATION: Record<PopoverPlacement, string> = {
  top: 'animate-kb-pop-top',
  bottom: 'animate-kb-pop-bottom',
  left: 'animate-kb-pop-left',
  right: 'animate-kb-pop-right',
} as const satisfies Record<PopoverPlacement, string>;

const EXIT_TRANSLATE: Record<PopoverPlacement, string> = {
  top: '0 6px',
  bottom: '0 -6px',
  left: '6px 0',
  right: '-6px 0',
} as const satisfies Record<PopoverPlacement, string>;

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
  /** How the popover is activated - `'click'` toggles on click, `'hover'` on mouse enter/leave. @defaultValue 'click' */
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
  /**
   * Accessible label for the dialog when no visible header is provided.
   * Used as `aria-label` on the `role="dialog"` element.
   * When a header slot is present, `aria-labelledby` is used automatically instead.
   */
  @property({ type: String, attribute: 'aria-label' }) override ariaLabel: string | null = null;

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;
  @state() private _isInteractiveTrigger: boolean = false;

  private readonly _titleId: string = `kb-popover-title-${++_popoverIdCounter}`;
  private _boundKeyHandler = this._handleKeyDown.bind(this);
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _previouslyFocused: HTMLElement | null = null;
  private _exitAnimation: Animation | null = null;
  private _openTimerId: ReturnType<typeof setTimeout> | null = null;
  private _closeTimerId: ReturnType<typeof setTimeout> | null = null;
  private _panelEl: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
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
    // Cache panel element once visible
    if (this._visible && !this._panelEl) {
      this._panelEl = this.querySelector<HTMLElement>('[role="dialog"]');
    }
    if (!this._visible) {
      this._panelEl = null;
    }
    // Cache interactive-trigger flag whenever trigger slot content may have changed
    const triggerEl = this.slotted('trigger');
    this._isInteractiveTrigger =
      triggerEl instanceof HTMLButtonElement ||
      triggerEl instanceof HTMLAnchorElement ||
      triggerEl instanceof HTMLInputElement ||
      (triggerEl !== null && (triggerEl.hasAttribute('tabindex') || triggerEl.hasAttribute('role')));
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
    if (this._exitAnimation !== null) {
      this._exitAnimation.cancel();
      this._exitAnimation = null;
    }
  }

  private _show(): void {
    this._clearTimers();
    this._dismissing = false;
    this._visible = true;

    document.addEventListener('keydown', this._boundKeyHandler);
    document.addEventListener('click', this._boundOutsideClick, true);
    this._previouslyFocused = document.activeElement as HTMLElement | null;

    this.emit('kb-open');

    if (this.autoFocus) {
      requestAnimationFrame(() => {
        this._focusFirst();
      });
    }
  }

  private _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const panel = this._panelEl ?? this.querySelector<HTMLElement>('[role="dialog"]');

    const onFinish = (): void => {
      this._exitAnimation = null;
      document.removeEventListener('keydown', this._boundKeyHandler);
      document.removeEventListener('click', this._boundOutsideClick, true);
      this._visible = false;
      this._dismissing = false;
      this._panelEl = null;
      this._restoreFocus();
      this.emit('kb-close');
    };

    if (panel) {
      const exitTranslate = EXIT_TRANSLATE[this.placement] ?? EXIT_TRANSLATE.bottom;
      const anim = panel.animate(
        [
          { translate: '0 0', opacity: 1 },
          { translate: exitTranslate, opacity: 0 },
        ],
        {
          duration: prefersReducedMotion() ? 0 : DISMISS_DURATION,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
          fill: 'forwards',
        },
      );
      this._exitAnimation = anim;
      anim.finished.then(() => {
        anim.commitStyles();
        anim.cancel();
        onFinish();
      }, onFinish);
    } else {
      onFinish();
    }
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

  private _handleTriggerKeyDown(e: KeyboardEvent): void {
    if (this.trigger !== 'click') return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleTriggerClick();
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

  private _handleFocusIn(): void {
    if (this.trigger !== 'hover') return;
    if (this._visible || this.open) return;

    if (this._closeTimerId !== null) {
      clearTimeout(this._closeTimerId);
      this._closeTimerId = null;
    }

    this._openPopover();
  }

  private _handleFocusOut(e: FocusEvent): void {
    if (this.trigger !== 'hover') return;
    if (!(this._visible || this.open)) return;

    const related = e.relatedTarget as Node | null;
    if (related && this.contains(related)) return;

    this._close();
  }

  private _renderCloseButton(): TemplateResult | typeof nothing {
    if (!this.closable) return nothing;

    const iconSize = CLOSE_ICON_SIZE[this.size] ?? CLOSE_ICON_SIZE.sm;

    return html`
      <button
        class=${cx(
          'cursor-pointer flex-shrink-0 select-none',
          kbClasses.textSecondary,
          kbClasses.hoverTextPrimary,
          kbClasses.transitionColors,
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

  private _renderHeader(headerEl: Element | null): TemplateResult | typeof nothing {
    if (!(headerEl || this.closable)) return nothing;
    const s = this.size;
    return html`
      <div class=${cx('flex items-center justify-between', HEADER_PX[s], kbClasses.borderBottom)}>
        ${headerEl ? html`<div id=${this._titleId} class="${kbClasses.label} select-none">${headerEl}</div>` : html`<div></div>`}
        ${this._renderCloseButton()}
      </div>`;
  }

  private _renderFooter(footerEl: Element | null): TemplateResult | typeof nothing {
    if (!footerEl) return nothing;
    return html`
      <div class=${cx(`flex items-center gap-2 border-t ${kbClasses.borderColor}`, FOOTER_PX[this.size])}>
        ${footerEl}
      </div>`;
  }

  private _renderPanel(headerEl: Element | null, footerEl: Element | null): TemplateResult | typeof nothing {
    if (!(this._visible || this.open)) return nothing;

    const p = this.placement;
    const s = this.size;

    const basePlacement = PLACEMENT_BASE[p] ?? PLACEMENT_BASE.bottom;
    const offsetVal = Math.max(0, Math.min(4, this.offset));
    const offsetClass = OFFSET_CLASSES[p]?.[offsetVal] ?? '';
    const arrowClasses = ARROW_CLASSES[p] ?? ARROW_CLASSES.bottom;

    const panelClasses = cx(
      'absolute z-50',
      basePlacement,
      offsetClass,
      SIZE_MIN_W[s],
      SIZE_MAX_W[s],
      kbClasses.surface,
      kbClasses.border,
      'font-sans',
      !this._dismissing && ENTER_ANIMATION[p],
    );

    return html`
      <div
        class=${panelClasses}
        style="contain:content"
        role="dialog"
        aria-labelledby=${headerEl ? this._titleId : nothing}
        aria-label=${!headerEl && this.ariaLabel ? this.ariaLabel : nothing}
        aria-modal=${this.trapFocus ? 'true' : nothing}
      >
        ${this.showArrow ? html`<div class=${arrowClasses}></div>` : nothing}
        ${this._renderHeader(headerEl)}
        <div class=${cx(BODY_TEXT[s], BODY_PX[s], kbClasses.textPrimary)}>
          ${this.defaultSlotContent}
        </div>
        ${this._renderFooter(footerEl)}
      </div>`;
  }

  override render(): TemplateResult {
    const showPanel = this._visible || this.open;
    const wrapperClasses = this.buildClasses('relative inline-block');
    const triggerEl = this.slotted('trigger');
    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');

    return html`
      <span
        class=${wrapperClasses}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @focusin=${this._handleFocusIn}
        @focusout=${this._handleFocusOut}
      >
        <span
          tabindex=${ifDefined(this._isInteractiveTrigger ? undefined : '0')}
          @click=${this._handleTriggerClick}
          @keydown=${this._handleTriggerKeyDown}
          aria-haspopup="dialog"
          aria-expanded=${this._visible ? 'true' : 'false'}
        >
          ${triggerEl}
        </span>
        ${showPanel ? this._renderPanel(headerEl, footerEl) : html`<span hidden>${this.defaultSlotContent}${headerEl}${footerEl}</span>`}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-popover': KbPopover;
  }
}
