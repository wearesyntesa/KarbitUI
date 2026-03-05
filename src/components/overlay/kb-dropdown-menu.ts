import { html, isServer, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import type { KbMenuItem } from './kb-menu-item.js';

type MenuPlacement = 'top' | 'bottom';

const PLACEMENT_BASE: Record<MenuPlacement, string> = {
  top: 'bottom-full left-0 mb-1',
  bottom: 'top-full left-0 mt-1',
} as const satisfies Record<MenuPlacement, string>;

const MENU_MIN_W: Record<ComponentSize, string> = {
  xs: 'min-w-[120px]',
  sm: 'min-w-[150px]',
  md: 'min-w-[180px]',
  lg: 'min-w-[220px]',
  xl: 'min-w-[260px]',
} as const satisfies Record<ComponentSize, string>;

const ITEM_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-base',
} as const satisfies Record<ComponentSize, string>;

const DISMISS_DURATION = 100;

const EXIT_TRANSLATE: Record<MenuPlacement, string> = {
  top: 'translateY(4px)',
  bottom: 'translateY(-4px)',
} as const satisfies Record<MenuPlacement, string>;

const ENTER_ANIMATION: Record<MenuPlacement, string> = {
  top: 'animate-kb-pop-top',
  bottom: 'animate-kb-pop-bottom',
} as const satisfies Record<MenuPlacement, string>;

/**
 * Action dropdown menu anchored to a trigger element.
 *
 * @slot trigger - Element that toggles the menu.
 * @slot - `kb-menu-item` elements.
 *
 * @fires kb-select - Dispatched when a menu item is selected (bubbles from child).
 * @fires kb-open - Dispatched when the menu opens.
 * @fires kb-close - Dispatched when the menu closes (after exit animation).
 */
export class KbDropdownMenu extends KbBaseElement<'trigger'> {
  /** Whether the menu panel is visible. */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Menu position relative to the trigger. */
  @property({ type: String }) placement: MenuPlacement = 'bottom';
  /** Menu sizing preset. */
  @property({ type: String }) size: ComponentSize = 'md';

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;

  private _boundKeyHandler = this._handleKeyDown.bind(this);
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _previouslyFocused: HTMLElement | null = null;
  private _exitAnimation: Animation | null = null;
  private _focusedIndex: number = -1;

  override connectedCallback(): void {
    super.connectedCallback();
    if (isServer) return;
    if (this.open) {
      this._show();
    }
    this.addEventListener('kb-select', this._handleItemSelect as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (isServer) return;
    document.removeEventListener('keydown', this._boundKeyHandler);
    document.removeEventListener('click', this._boundOutsideClick, true);
    this.removeEventListener('kb-select', this._handleItemSelect as EventListener);
    this._cancelExit();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (isServer) return;
    if (changed.has('open')) {
      if (this.open) {
        this._show();
      } else if (changed.get('open') === true) {
        this._animateDismiss();
      }
    }
  }

  private _cancelExit(): void {
    if (this._exitAnimation !== null) {
      this._exitAnimation.cancel();
      this._exitAnimation = null;
    }
  }

  private _getItems(): KbMenuItem[] {
    return Array.from(this.querySelectorAll<KbMenuItem>('kb-menu-item:not([disabled])'));
  }

  private _focusItem(index: number): void {
    const items = this._getItems();
    if (items.length === 0) return;
    const clamped = ((index % items.length) + items.length) % items.length;
    this._focusedIndex = clamped;
    const item = items[clamped];
    const focusTarget = item?.querySelector<HTMLElement>('[role="menuitem"]') ?? item;
    focusTarget?.focus();
  }

  private _show(): void {
    this._cancelExit();
    this._dismissing = false;
    this._visible = true;
    this._focusedIndex = -1;

    document.addEventListener('keydown', this._boundKeyHandler);
    document.addEventListener('click', this._boundOutsideClick, true);
    this._previouslyFocused = document.activeElement as HTMLElement | null;

    this.emit('kb-open');

    requestAnimationFrame(() => {
      this._focusItem(0);
    });
  }

  private _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const panel = this.querySelector<HTMLElement>('[data-kb-menu-panel]');

    const onFinish = (): void => {
      this._exitAnimation = null;
      document.removeEventListener('keydown', this._boundKeyHandler);
      document.removeEventListener('click', this._boundOutsideClick, true);
      this._visible = false;
      this._dismissing = false;
      this._focusedIndex = -1;
      this._restoreFocus();
      this.emit('kb-close');
    };

    if (panel) {
      const exitTranslate = EXIT_TRANSLATE[this.placement] ?? EXIT_TRANSLATE.bottom;
      const anim = panel.animate(
        [
          { transform: 'translateY(0)', opacity: 1 },
          { transform: exitTranslate, opacity: 0 },
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

  private _handleTriggerClick(): void {
    if (this.open || this._visible) {
      this._close();
    } else {
      this.open = true;
    }
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (!this._visible || this._dismissing) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._focusItem(this._focusedIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusItem(this._focusedIndex - 1);
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const items = this._getItems();
        const current = items[this._focusedIndex];
        if (current) {
          current.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
        break;
      }
      case 'Home':
        e.preventDefault();
        this._focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        this._focusItem(this._getItems().length - 1);
        break;
    }
  }

  private _handleOutsideClick(e: MouseEvent): void {
    if (!this._visible || this._dismissing) return;
    if (!this.contains(e.target as Node)) {
      this._close();
    }
  }

  private _handleItemSelect = (): void => {
    this._close();
  };

  private _renderPanel(): TemplateResult {
    const placementClass = PLACEMENT_BASE[this.placement] ?? PLACEMENT_BASE.bottom;
    const panelClasses = cx(
      'absolute z-50 max-w-[calc(100vw-2rem)]',
      placementClass,
      MENU_MIN_W[this.size],
      ITEM_TEXT[this.size],
      kbClasses.surface,
      kbClasses.border,
      'font-sans py-1',
      !this._dismissing && ENTER_ANIMATION[this.placement],
    );

    return html`
      <div class=${panelClasses} role="menu" data-kb-menu-panel>
        ${this.defaultSlotContent}
      </div>
    `;
  }

  override render(): TemplateResult {
    const showPanel = this._visible || this.open;
    const wrapperClasses = this.buildClasses('relative inline-block');
    const triggerEl = this.slotted('trigger');

    return html`
      <span class=${wrapperClasses}>
        <span
          @click=${this._handleTriggerClick}
          aria-haspopup="menu"
          aria-expanded=${this._visible ? 'true' : 'false'}
        >
          ${triggerEl}
        </span>
        ${showPanel ? this._renderPanel() : html`<span hidden>${this.defaultSlotContent}</span>`}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-dropdown-menu': KbDropdownMenu;
  }
}
