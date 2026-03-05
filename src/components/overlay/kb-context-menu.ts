import { html, isServer, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import type { KbMenuItem } from './kb-menu-item.js';

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

/**
 * Right-click context menu anchored to a trigger area.
 *
 * @slot - `kb-menu-item` elements as menu entries.
 * @slot trigger - Area that listens for `contextmenu` events.
 *
 * @fires kb-select - Dispatched when a menu item is selected.
 * @fires kb-open - Dispatched when the menu opens.
 * @fires kb-close - Dispatched when the menu closes (after exit animation).
 *
 * @example
 * ```html
 * <kb-context-menu>
 *   <div slot="trigger" style="padding:2rem;border:1px dashed gray">
 *     Right-click here
 *   </div>
 *   <kb-menu-item value="copy">Copy</kb-menu-item>
 *   <kb-menu-item value="paste">Paste</kb-menu-item>
 *   <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
 * </kb-context-menu>
 * ```
 */
export class KbContextMenu extends KbBaseElement<'trigger'> {
  static override hostDisplay = 'block' as const;

  /** Menu sizing preset. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';

  @state() private _visible: boolean = false;
  @state() private _dismissing: boolean = false;
  @state() private _x: number = 0;
  @state() private _y: number = 0;

  private _boundKeyHandler = this._handleKeyDown.bind(this);
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _exitAnimation: Animation | null = null;
  private _focusedIndex: number = -1;

  override connectedCallback(): void {
    super.connectedCallback();
    if (isServer) return;
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

  private _handleContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    const rect = this.getBoundingClientRect();
    const margin = 16;
    const menuWidth = 260;
    const menuHeight = 200;
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (e.clientX + menuWidth > window.innerWidth - margin) {
      x = Math.max(0, window.innerWidth - margin - menuWidth - rect.left);
    }
    if (e.clientY + menuHeight > window.innerHeight - margin) {
      y = Math.max(0, window.innerHeight - margin - menuHeight - rect.top);
    }
    this._x = x;
    this._y = y;
    this._show();
  };

  private _show(): void {
    this._cancelExit();
    this._dismissing = false;
    this._visible = true;
    this._focusedIndex = -1;

    document.addEventListener('keydown', this._boundKeyHandler);
    document.addEventListener('click', this._boundOutsideClick, true);

    this.emit('kb-open');

    requestAnimationFrame(() => {
      this._focusItem(0);
    });
  }

  private _animateDismiss(): void {
    if (!this._visible || this._dismissing) return;
    this._dismissing = true;

    const panel = this.querySelector<HTMLElement>('[data-kb-context-panel]');

    const onFinish = (): void => {
      this._exitAnimation = null;
      document.removeEventListener('keydown', this._boundKeyHandler);
      document.removeEventListener('click', this._boundOutsideClick, true);
      this._visible = false;
      this._dismissing = false;
      this._focusedIndex = -1;
      this.emit('kb-close');
    };

    if (panel) {
      const anim = panel.animate(
        [
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(0.95)', opacity: 0 },
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
    if (!this._visible) return;
    this._animateDismiss();
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

  override render(): TemplateResult {
    const showPanel = this._visible;
    const wrapperClasses = this.buildClasses('relative');
    const triggerEl = this.slotted('trigger');

    const panelClasses = cx(
      'absolute z-50 max-w-[calc(100vw-2rem)]',
      MENU_MIN_W[this.size],
      ITEM_TEXT[this.size],
      kbClasses.surface,
      kbClasses.border,
      'font-sans py-1',
      !this._dismissing && 'animate-kb-pop-bottom',
    );

    return html`
      <div class=${wrapperClasses}>
        <div @contextmenu=${this._handleContextMenu}>
          ${triggerEl}
        </div>
        ${
          showPanel
            ? html`<div
              class=${panelClasses}
              role="menu"
              data-kb-context-panel
              style="position:absolute;left:${this._x}px;top:${this._y}px"
            >
              ${this.defaultSlotContent}
            </div>`
            : html`<span hidden>${this.defaultSlotContent}</span>`
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-context-menu': KbContextMenu;
  }
}
