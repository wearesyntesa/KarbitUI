import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { cx } from '../../utils/cx.js';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
type TooltipSize = 'xs' | 'sm' | 'md';
type TooltipVariant = 'dark' | 'light';

const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2',
  bottom: 'top-full left-1/2 -translate-x-1/2',
  left: 'right-full top-1/2 -translate-y-1/2',
  right: 'left-full top-1/2 -translate-y-1/2',
};

const OFFSET_CLASSES: Record<TooltipPlacement, Record<number, string>> = {
  top: { 0: 'mb-0', 1: 'mb-1', 2: 'mb-2', 3: 'mb-3', 4: 'mb-4' },
  bottom: { 0: 'mt-0', 1: 'mt-1', 2: 'mt-2', 3: 'mt-3', 4: 'mt-4' },
  left: { 0: 'mr-0', 1: 'mr-1', 2: 'mr-2', 3: 'mr-3', 4: 'mr-4' },
  right: { 0: 'ml-0', 1: 'ml-1', 2: 'ml-2', 3: 'ml-3', 4: 'ml-4' },
};

const SIZE_TEXT: Record<TooltipSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
};

const SIZE_PX: Record<TooltipSize, string> = {
  xs: 'px-1.5 py-0.5',
  sm: 'px-2 py-1',
  md: 'px-2.5 py-1.5',
};

const SIZE_MAX_W: Record<TooltipSize, string> = {
  xs: 'max-w-[160px]',
  sm: 'max-w-[200px]',
  md: 'max-w-[280px]',
};

const VARIANT_CLASSES: Record<TooltipVariant, string> = {
  dark: 'bg-zinc-900 text-zinc-50 border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200',
  light: 'bg-white text-slate-900 border-gray-200 dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700',
};

const ARROW_BASE = 'absolute w-2 h-2 rotate-45';

const ARROW_DARK = 'bg-zinc-900 dark:bg-zinc-100';
const ARROW_LIGHT = 'bg-white dark:bg-zinc-800';

const ARROW_BORDER_DARK: Record<TooltipPlacement, string> = {
  bottom: 'border-t border-l border-zinc-700 dark:border-zinc-200',
  top: 'border-b border-r border-zinc-700 dark:border-zinc-200',
  right: 'border-b border-l border-zinc-700 dark:border-zinc-200',
  left: 'border-t border-r border-zinc-700 dark:border-zinc-200',
};

const ARROW_BORDER_LIGHT: Record<TooltipPlacement, string> = {
  bottom: 'border-t border-l border-gray-200 dark:border-zinc-700',
  top: 'border-b border-r border-gray-200 dark:border-zinc-700',
  right: 'border-b border-l border-gray-200 dark:border-zinc-700',
  left: 'border-t border-r border-gray-200 dark:border-zinc-700',
};

const ARROW_POSITION: Record<TooltipPlacement, string> = {
  bottom: '-top-1 left-1/2 -translate-x-1/2',
  top: '-bottom-1 left-1/2 -translate-x-1/2',
  right: '-left-1 top-1/2 -translate-y-1/2',
  left: '-right-1 top-1/2 -translate-y-1/2',
};

const DISMISS_DURATION = 100;

let tooltipIdCounter = 0;

/**
 * Text tooltip shown on hover/focus over a trigger element with animated
 * enter/exit, optional arrow, size variants, and programmatic control.
 *
 * @slot - Trigger element that activates the tooltip on hover/focus.
 *
 * @fires kb-open - Dispatched when tooltip becomes visible.
 * @fires kb-close - Dispatched when tooltip is hidden (after exit animation).
 *
 * @example
 * ```html
 * <kb-tooltip label="Delete this item" placement="top" show-arrow>
 *   <kb-icon-button aria-label="Delete">X</kb-icon-button>
 * </kb-tooltip>
 * ```
 */
@customElement('kb-tooltip')
export class KbTooltip extends KbBaseElement {
  @property({ type: String }) label: string = '';
  @property({ type: String }) placement: TooltipPlacement = 'top';
  @property({ type: String }) size: TooltipSize = 'sm';
  @property({ type: String }) variant: TooltipVariant = 'dark';
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  @property({ type: Boolean, attribute: 'show-arrow' }) showArrow: boolean = true;
  @property({ type: Number }) offset: number = 2;
  @property({ type: Number, attribute: 'open-delay' }) openDelay: number = 200;
  @property({ type: Number, attribute: 'close-delay' }) closeDelay: number = 0;

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;

  private _openTimerId: ReturnType<typeof setTimeout> | null = null;
  private _closeTimerId: ReturnType<typeof setTimeout> | null = null;
  private _dismissTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly _tooltipId = `kb-tooltip-${++tooltipIdCounter}`;

  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
    if (this.open) {
      this._show();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
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
    if (this._openTimerId !== null) { clearTimeout(this._openTimerId); this._openTimerId = null; }
    if (this._closeTimerId !== null) { clearTimeout(this._closeTimerId); this._closeTimerId = null; }
    if (this._dismissTimeout !== null) { clearTimeout(this._dismissTimeout); this._dismissTimeout = null; }
  }

  private _show(): void {
    if (this.disabled || !this.label) return;
    this._clearTimers();
    this._dismissing = false;
    this._visible = true;

    requestAnimationFrame(() => {
      this.dispatchEvent(new CustomEvent('kb-open', { bubbles: true, composed: true }));
    });
  }

  private _hide(): void {
    if (!this._visible && !this.open) return;
    this.open = false;
    if (!this._dismissing) {
      this._animateDismiss();
    }
  }

  private _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const tip = this.querySelector<HTMLElement>(`#${this._tooltipId}`);

    if (tip) {
      tip.style.transition = `opacity ${DISMISS_DURATION}ms ease-in`;
      tip.style.opacity = '0';
    }

    const onFinish = (): void => {
      if (this._dismissTimeout !== null) {
        clearTimeout(this._dismissTimeout);
        this._dismissTimeout = null;
      }
      tip?.removeEventListener('transitionend', onFinish);
      this._visible = false;
      this._dismissing = false;
      this.dispatchEvent(new CustomEvent('kb-close', { bubbles: true, composed: true }));
    };

    tip?.addEventListener('transitionend', onFinish, { once: true });
    this._dismissTimeout = setTimeout(onFinish, DISMISS_DURATION + 50);
  }

  private _handleMouseEnter(): void {
    if (this._closeTimerId !== null) {
      clearTimeout(this._closeTimerId);
      this._closeTimerId = null;
    }

    if (this._visible || this.open) return;

    const delay = this.openDelay;
    if (delay > 0) {
      this._openTimerId = setTimeout(() => {
        this._openTimerId = null;
        this._show();
      }, delay);
    } else {
      this._show();
    }
  }

  private _handleMouseLeave(): void {
    if (this._openTimerId !== null) {
      clearTimeout(this._openTimerId);
      this._openTimerId = null;
    }

    if (!this._visible && !this.open) return;

    const delay = this.closeDelay;
    if (delay > 0) {
      this._closeTimerId = setTimeout(() => {
        this._closeTimerId = null;
        this._hide();
      }, delay);
    } else {
      this._hide();
    }
  }

  private _handleFocusIn(): void {
    if (this._visible || this.open) return;
    this._show();
  }

  private _handleFocusOut(): void {
    if (!this._visible && !this.open) return;
    this._hide();
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && (this._visible || this.open)) {
      e.preventDefault();
      this._hide();
    }
  }

  private _getArrowClasses(): string {
    const p = this.placement;
    const surface = this.variant === 'dark' ? ARROW_DARK : ARROW_LIGHT;
    const border = this.variant === 'dark' ? ARROW_BORDER_DARK[p] : ARROW_BORDER_LIGHT[p];
    const position = ARROW_POSITION[p];
    return `${ARROW_BASE} ${position} ${surface} ${border}`;
  }

  override render() {
    const p = this.placement;
    const s = this.size;

    const wrapperClasses = this.buildClasses('relative inline-block');

    const offsetVal = Math.max(0, Math.min(4, this.offset));
    const offsetClass = OFFSET_CLASSES[p]?.[offsetVal] ?? '';

    const tipClasses = cx(
      'absolute z-50 pointer-events-none border font-mono',
      PLACEMENT_CLASSES[p],
      offsetClass,
      SIZE_TEXT[s],
      SIZE_PX[s],
      SIZE_MAX_W[s],
      VARIANT_CLASSES[this.variant],
      !this._dismissing && 'animate-kb-fade-in',
    );

    return html`
      <span
        class=${wrapperClasses}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @focusin=${this._handleFocusIn}
        @focusout=${this._handleFocusOut}
        @keydown=${this._handleKeyDown}
      >
        <span aria-describedby=${this._visible ? this._tooltipId : nothing}>
          ${this.defaultSlotContent}
        </span>
        ${this._visible || this.open
          ? html`
            <span id=${this._tooltipId} class=${tipClasses} role="tooltip">
              ${this.showArrow ? html`<span class=${this._getArrowClasses()}></span>` : nothing}
              ${this.label}
            </span>`
          : nothing
        }
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-tooltip': KbTooltip;
  }
}
