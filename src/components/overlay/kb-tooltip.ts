import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipSize = 'xs' | 'sm' | 'md';
export type TooltipVariant = 'dark' | 'light';

const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2',
  bottom: 'top-full left-1/2 -translate-x-1/2',
  left: 'right-full top-1/2 -translate-y-1/2',
  right: 'left-full top-1/2 -translate-y-1/2',
} as const satisfies Record<TooltipPlacement, string>;

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
} as const satisfies Record<TooltipSize, string>;

const SIZE_PX: Record<TooltipSize, string> = {
  xs: 'px-1.5 py-0.5',
  sm: 'px-2 py-1',
  md: 'px-2.5 py-1.5',
} as const satisfies Record<TooltipSize, string>;

const SIZE_MAX_W: Record<TooltipSize, string> = {
  xs: 'max-w-[160px]',
  sm: 'max-w-[200px]',
  md: 'max-w-[280px]',
} as const satisfies Record<TooltipSize, string>;

const VARIANT_CLASSES: Record<TooltipVariant, string> = {
  dark: 'bg-zinc-900 text-zinc-50 border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200',
  light: 'bg-white text-slate-900 border-gray-200 dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700',
} as const satisfies Record<TooltipVariant, string>;

const ARROW_BASE = 'absolute w-2 h-2 rotate-45';

const ARROW_DARK = 'bg-zinc-900 dark:bg-zinc-100';
const ARROW_LIGHT = 'bg-white dark:bg-zinc-800';

const ARROW_BORDER_DARK: Record<TooltipPlacement, string> = {
  bottom: 'border-t border-l border-zinc-700 dark:border-zinc-200',
  top: 'border-b border-r border-zinc-700 dark:border-zinc-200',
  right: 'border-b border-l border-zinc-700 dark:border-zinc-200',
  left: 'border-t border-r border-zinc-700 dark:border-zinc-200',
} as const satisfies Record<TooltipPlacement, string>;

const ARROW_BORDER_LIGHT: Record<TooltipPlacement, string> = {
  bottom: `border-t border-l ${kbClasses.borderColor}`,
  top: `border-b border-r ${kbClasses.borderColor}`,
  right: `border-b border-l ${kbClasses.borderColor}`,
  left: `border-t border-r ${kbClasses.borderColor}`,
} as const satisfies Record<TooltipPlacement, string>;

const ARROW_POSITION: Record<TooltipPlacement, string> = {
  bottom: '-top-1 left-1/2 -translate-x-1/2',
  top: '-bottom-1 left-1/2 -translate-x-1/2',
  right: '-left-1 top-1/2 -translate-y-1/2',
  left: '-right-1 top-1/2 -translate-y-1/2',
} as const satisfies Record<TooltipPlacement, string>;

const DISMISS_DURATION = 100;

let tooltipIdCounter: number = 0;

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
  /** Text content shown inside the tooltip. No tooltip renders when empty. @defaultValue '' */
  @property({ type: String }) label: string = '';
  /** Position of the tooltip relative to the trigger element. @defaultValue 'top' */
  @property({ type: String }) placement: TooltipPlacement = 'top';
  /** Tooltip text and padding size. @defaultValue 'sm' */
  @property({ type: String }) size: TooltipSize = 'sm';
  /** Color variant - `'dark'` (inverted) or `'light'` (surface-colored). @defaultValue 'dark' */
  @property({ type: String }) variant: TooltipVariant = 'dark';
  /** Prevents the tooltip from showing. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Programmatically control visibility. Reflected to attribute. @defaultValue false */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Render a small arrow pointing toward the trigger element. @defaultValue true */
  @property({ type: Boolean, attribute: 'show-arrow' }) showArrow: boolean = true;
  /** Distance between the tooltip and the trigger (0–4 Tailwind spacing units). @defaultValue 2 */
  @property({ type: Number }) offset: number = 2;
  /** Delay in ms before showing the tooltip on hover. @defaultValue 200 */
  @property({ type: Number, attribute: 'open-delay' }) openDelay: number = 200;
  /** Delay in ms before hiding the tooltip after mouse leaves. @defaultValue 0 */
  @property({ type: Number, attribute: 'close-delay' }) closeDelay: number = 0;

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;

  private _openTimerId: ReturnType<typeof setTimeout> | null = null;
  private _closeTimerId: ReturnType<typeof setTimeout> | null = null;
  private _exitAnimation: Animation | null = null;
  private readonly _tooltipId = `kb-tooltip-${++tooltipIdCounter}`;
  private _tipEl: HTMLElement | null = null;
  private _cachedArrowClasses: string = '';

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.open) {
      this._show();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearTimers();
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (this._cachedArrowClasses === '' || changed.has('placement') || changed.has('variant')) {
      this._cachedArrowClasses = this._getArrowClasses();
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
    // Cache tip element once visible; clear when hidden
    if (this._visible && !this._tipEl) {
      this._tipEl = this.querySelector<HTMLElement>(`#${this._tooltipId}`);
    }
    if (!this._visible) {
      this._tipEl = null;
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
    if (this._exitAnimation !== null) {
      this._exitAnimation.cancel();
      this._exitAnimation = null;
    }
  }

  private _show(): void {
    if (this.disabled || !this.label) return;
    this._clearTimers();
    this._dismissing = false;
    this._visible = true;
    this.emit('kb-open');
  }

  private _hide(): void {
    if (!(this._visible || this.open)) return;
    this.open = false;
    if (!this._dismissing) {
      this._animateDismiss();
    }
  }

  private _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const tip = this._tipEl ?? this.querySelector<HTMLElement>(`#${this._tooltipId}`);

    const onFinish = (): void => {
      this._exitAnimation = null;
      this._visible = false;
      this._dismissing = false;
      this._tipEl = null;
      this.emit('kb-close');
    };

    if (tip) {
      const anim = tip.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: prefersReducedMotion() ? 0 : DISMISS_DURATION,
        easing: 'ease-in',
        fill: 'forwards',
      });
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

    if (!(this._visible || this.open)) return;

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
    if (!(this._visible || this.open)) return;
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

  override render(): TemplateResult {
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
      !this._dismissing && 'animate-kb-fade-in-fast',
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
        <span aria-describedby=${this._tooltipId}>
          ${this.defaultSlotContent}
        </span>
        ${
          this._visible || this.open
            ? html`
            <span id=${this._tooltipId} class="${tipClasses} select-none" style="contain:content" role="tooltip">
              ${this.showArrow ? html`<span class=${this._cachedArrowClasses}></span>` : nothing}
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
