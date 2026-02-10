import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';
import type { KbTabChangeDetail } from '../../core/events.js';
import type { KnownColorScheme } from '../../core/types.js';

export type TabsVariant = 'line' | 'enclosed' | 'solid' | 'unstyled';
export type TabsSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsColorScheme = KnownColorScheme;
export type TabsAlign = 'start' | 'center' | 'end';

/** Size → text, padding, gap, icon size maps */
const SIZE_TEXT: Record<TabsSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
};

const SIZE_PX: Record<TabsSize, string> = {
  xs: 'px-2',
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-5',
  xl: 'px-6',
};

const SIZE_PY: Record<TabsSize, string> = {
  xs: 'py-1',
  sm: 'py-1.5',
  md: 'py-2',
  lg: 'py-2.5',
  xl: 'py-3',
};

const SIZE_GAP: Record<TabsSize, string> = {
  xs: 'gap-0.5',
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
  xl: 'gap-2.5',
};

const SIZE_ICON: Record<TabsSize, string> = {
  xs: '[&>svg]:w-3 [&>svg]:h-3',
  sm: '[&>svg]:w-3.5 [&>svg]:h-3.5',
  md: '[&>svg]:w-4 [&>svg]:h-4',
  lg: '[&>svg]:w-5 [&>svg]:h-5',
  xl: '[&>svg]:w-6 [&>svg]:h-6',
};

const SIZE_PANEL_PT: Record<TabsSize, string> = {
  xs: 'pt-2',
  sm: 'pt-3',
  md: 'pt-4',
  lg: 'pt-5',
  xl: 'pt-6',
};

const SIZE_PANEL_PL: Record<TabsSize, string> = {
  xs: 'pl-2',
  sm: 'pl-3',
  md: 'pl-4',
  lg: 'pl-5',
  xl: 'pl-6',
};

const SIZE_INDICATOR_H: Record<TabsSize, string> = {
  xs: 'h-[1.5px]',
  sm: 'h-[1.5px]',
  md: 'h-0.5',
  lg: 'h-0.5',
  xl: 'h-[3px]',
};

const SIZE_INDICATOR_W_VERT: Record<TabsSize, string> = {
  xs: 'w-[1.5px]',
  sm: 'w-[1.5px]',
  md: 'w-0.5',
  lg: 'w-0.5',
  xl: 'w-[3px]',
};

/** ColorScheme maps */
const COLOR_ACTIVE_TEXT: Record<KnownColorScheme, string> = {
  blue: 'text-blue-500 dark:text-blue-400',
  red: 'text-red-500 dark:text-red-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  black: 'text-slate-900 dark:text-zinc-50',
};

const COLOR_INDICATOR: Record<KnownColorScheme, string> = {
  blue: 'bg-blue-500 dark:bg-blue-400',
  red: 'bg-red-500 dark:bg-red-400',
  green: 'bg-green-600 dark:bg-green-400',
  yellow: 'bg-yellow-600 dark:bg-yellow-400',
  black: 'bg-slate-900 dark:bg-zinc-50',
};

const COLOR_SOLID_ACTIVE_BG: Record<KnownColorScheme, string> = {
  blue: 'bg-blue-500 dark:bg-blue-600',
  red: 'bg-red-500 dark:bg-red-600',
  green: 'bg-green-600 dark:bg-green-700',
  yellow: 'bg-yellow-500 dark:bg-yellow-600',
  black: 'bg-slate-900 dark:bg-zinc-100',
};

const COLOR_SOLID_ACTIVE_TEXT: Record<KnownColorScheme, string> = {
  blue: 'text-white',
  red: 'text-white',
  green: 'text-white',
  yellow: 'text-white',
  black: 'text-white dark:text-zinc-900',
};

const COLOR_ENCLOSED_ACTIVE_BORDER: Record<KnownColorScheme, string> = {
  blue: 'border-t-blue-500 dark:border-t-blue-400',
  red: 'border-t-red-500 dark:border-t-red-400',
  green: 'border-t-green-600 dark:border-t-green-400',
  yellow: 'border-t-yellow-600 dark:border-t-yellow-400',
  black: 'border-t-slate-900 dark:border-t-zinc-50',
};

const disabledTabsConverter = {
  fromAttribute(value: string | null): number[] {
    if (!value) return [];
    return value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !Number.isNaN(n));
  },
  toAttribute(value: number[]): string {
    return value.join(',');
  },
};

interface IndicatorPosition {
  offset: number;
  size: number;
}

/**
 * Enhanced tab navigation with sliding active indicator, keyboard navigation,
 * sizes, color schemes, orientations, and panel animations.
 *
 * @slot tab-N - Tab trigger labels (e.g. `<span slot="tab-0">`, `<span slot="tab-1">`).
 * @slot icon-N - Optional icon for tab N (e.g. `<span slot="icon-0">`).
 * @slot panel-N - Tab panel content (e.g. `<div slot="panel-0">`).
 *
 * @fires kb-tab-change - Dispatched when active tab changes, with `detail.index` and `detail.previousIndex`.
 *
 * @example
 * ```html
 * <kb-tabs active="0" variant="line" size="md" color-scheme="blue">
 *   <span slot="tab-0">Overview</span>
 *   <span slot="tab-1">Settings</span>
 *   <div slot="panel-0">Overview content</div>
 *   <div slot="panel-1">Settings content</div>
 * </kb-tabs>
 * ```
 */
@customElement('kb-tabs')
export class KbTabs extends KbBaseElement {
  static override hostDisplay = 'block';

  /** Zero-based index of the currently active tab. @defaultValue 0 */
  @property({ type: Number }) active: number = 0;
  /** Visual variant controlling tab styling — `'line'` (indicator bar), `'enclosed'` (bordered tabs), `'solid'` (filled background), or `'unstyled'`. @defaultValue 'line' */
  @property({ type: String }) variant: TabsVariant = 'line';
  /** Tab text and padding size. @defaultValue 'md' */
  @property({ type: String }) size: TabsSize = 'md';
  /** Accent color scheme for active tab indicator and text. @defaultValue 'blue' */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme: KnownColorScheme = 'blue';
  /** Stretch tabs to fill the available width equally. @defaultValue false */
  @property({ type: Boolean }) fitted: boolean = false;
  /** Tab list layout direction. @defaultValue 'horizontal' */
  @property({ type: String }) orientation: TabsOrientation = 'horizontal';
  /** Horizontal/vertical alignment of tabs within the tab list. @defaultValue 'start' */
  @property({ type: String }) align: TabsAlign = 'start';
  /** Array of zero-based tab indices that should be disabled. Attribute accepts comma-separated numbers. @defaultValue [] */
  @property({ attribute: 'disabled-tabs', converter: disabledTabsConverter }) disabledTabs: number[] = [];

  @state() private _indicatorPos: IndicatorPosition = { offset: 0, size: 0 };
  @state() private _panelKey: number = 0;

  private _resizeObserver: ResizeObserver | null = null;
  private _tabButtons: HTMLButtonElement[] = [];
  private _disabledSet: Set<number> = new Set();
  private _cachedTabs: HTMLElement[] = [];
  private _cachedPanels: HTMLElement[] = [];
  private _cachedIcons: Map<number, HTMLElement> = new Map();

  private get _isVertical(): boolean {
    return this.orientation === 'vertical';
  }

  override connectedCallback(): void {
    this._cachedTabs = Array.from(this.querySelectorAll<HTMLElement>('[slot^="tab-"]'));
    this._cachedPanels = Array.from(this.querySelectorAll<HTMLElement>('[slot^="panel-"]'));
    this._cachedTabs.forEach((_, i) => {
      const icon = this.querySelector<HTMLElement>(`[slot="icon-${i}"]`);
      if (icon) this._cachedIcons.set(i, icon);
    });
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver(() => {
      this._measureIndicator();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (changed.has('disabledTabs')) {
      this._disabledSet = new Set(this.disabledTabs);
    }
  }

  override firstUpdated(): void {
    this._measureIndicator();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('active') || changed.has('orientation') || changed.has('variant') || changed.has('size')) {
      requestAnimationFrame(() => this._measureIndicator());
    }
    if (changed.has('active')) {
      this._panelKey++;
    }
  }

  private _measureIndicator(): void {
    const tabList = this.querySelector<HTMLElement>('[role="tablist"]');
    if (!tabList) return;

    this._tabButtons = Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]'));

    // Observe the tablist for resize
    this._resizeObserver?.disconnect();
    this._resizeObserver?.observe(tabList);

    const activeBtn = this._tabButtons[this.active];
    if (!activeBtn) return;

    if (this._isVertical) {
      this._indicatorPos = {
        offset: activeBtn.offsetTop,
        size: activeBtn.offsetHeight,
      };
    } else {
      this._indicatorPos = {
        offset: activeBtn.offsetLeft,
        size: activeBtn.offsetWidth,
      };
    }
  }

  private _handleTabClick(index: number): void {
    if (this._disabledSet.has(index)) return;
    if (index === this.active) return;
    const previousIndex = this.active;
    this.active = index;
    this.dispatchEvent(
      new CustomEvent<KbTabChangeDetail>('kb-tab-change', {
        detail: { index, previousIndex },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleKeydown(e: KeyboardEvent): void {
    const tabs = this._tabButtons;
    if (!tabs.length) return;

    const disabled = this._disabledSet;
    const isVert = this._isVertical;

    const nextKey = isVert ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVert ? 'ArrowUp' : 'ArrowLeft';

    let targetIndex: number | undefined;

    if (e.key === nextKey) {
      e.preventDefault();
      targetIndex = this._findNextEnabled(this.active, 1, tabs.length, disabled);
    } else if (e.key === prevKey) {
      e.preventDefault();
      targetIndex = this._findNextEnabled(this.active, -1, tabs.length, disabled);
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = this._findNextEnabled(-1, 1, tabs.length, disabled);
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = this._findNextEnabled(tabs.length, -1, tabs.length, disabled);
    }

    if (targetIndex !== undefined) {
      this._handleTabClick(targetIndex);
      tabs[targetIndex]?.focus();
    }
  }

  private _findNextEnabled(from: number, direction: 1 | -1, count: number, disabled: Set<number>): number | undefined {
    for (let i = 1; i <= count; i++) {
      const idx = ((from + direction * i) % count + count) % count;
      if (!disabled.has(idx)) return idx;
    }
    return undefined;
  }

  override render() {
    const tabs = this._cachedTabs;
    const panels = this._cachedPanels;
    const disabled = this._disabledSet;
    const isVert = this._isVertical;
    const v = this.variant;
    const s = this.size;
    const cs = this.colorScheme;

    const alignMap: Record<TabsAlign, string> = {
      start: isVert ? 'items-start' : 'justify-start',
      center: isVert ? 'items-center' : 'justify-center',
      end: isVert ? 'items-end' : 'justify-end',
    };

    // ---- Tab list classes ----
    const tabListClasses = cx(
      'relative flex',
      isVert ? 'flex-col' : 'flex-row',
      !this.fitted && alignMap[this.align],
      v === 'line' && !isVert ? 'border-b border-gray-200 dark:border-zinc-700' : '',
      v === 'line' && isVert ? 'border-r border-gray-200 dark:border-zinc-700' : '',
      v === 'enclosed' && !isVert ? 'border-b border-gray-200 dark:border-zinc-700' : '',
      v === 'enclosed' && isVert ? 'border-r border-gray-200 dark:border-zinc-700' : '',
      v === 'solid' ? `${kbClasses.surfaceMuted} ${kbClasses.border} p-1 gap-1` : '',
    );

    // ---- Tab button classes per index ----
    const getTabClasses = (index: number): string => {
      const isActive = index === this.active;
      const isDisabled = disabled.has(index);
      const fitClass = this.fitted ? 'flex-1 text-center justify-center' : '';

      const base = cx(
        'relative inline-flex items-center font-mono uppercase tracking-widest cursor-pointer select-none',
        kbClasses.transition,
        SIZE_TEXT[s],
        SIZE_PX[s],
        SIZE_PY[s],
        SIZE_GAP[s],
        fitClass,
        kbClasses.focus,
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
      );

      if (v === 'line') {
        return cx(
          base,
          !isVert && '-mb-px',
          isVert && '-mr-px',
          isActive ? COLOR_ACTIVE_TEXT[cs] : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50',
        );
      }

      if (v === 'enclosed') {
        return cx(
          base,
          'border border-gray-200 dark:border-zinc-700',
          !isVert && '-mb-px',
          isVert && '-mr-px',
          isActive
            ? cx(
                'bg-white dark:bg-zinc-900 border-t-2',
                COLOR_ENCLOSED_ACTIVE_BORDER[cs],
                !isVert ? 'border-b-white dark:border-b-zinc-900' : '',
                isVert ? 'border-r-white dark:border-r-zinc-900' : '',
                COLOR_ACTIVE_TEXT[cs],
              )
            : 'bg-gray-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 border-t-2 border-t-transparent',
        );
      }

      if (v === 'solid') {
        return cx(
          base,
          isActive
            ? cx(COLOR_SOLID_ACTIVE_BG[cs], COLOR_SOLID_ACTIVE_TEXT[cs])
            : 'text-slate-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700',
        );
      }

      // unstyled
      return cx(
        base,
        isActive ? COLOR_ACTIVE_TEXT[cs] : 'text-slate-500 dark:text-zinc-400',
      );
    };

    // ---- Sliding indicator (line variant only) ----
    const showIndicator = v === 'line' && this._indicatorPos.size > 0;
    const indicatorStyle = showIndicator
      ? isVert
        ? `top:${this._indicatorPos.offset}px;height:${this._indicatorPos.size}px;right:0;`
        : `left:${this._indicatorPos.offset}px;width:${this._indicatorPos.size}px;bottom:0;`
      : '';

    // ---- Panel classes ----
    const panelClasses = cx(
      'font-sans',
      kbClasses.textPrimary,
      v === 'enclosed' && !isVert ? 'border border-gray-200 dark:border-zinc-700 border-t-0 p-4' : '',
      v === 'enclosed' && isVert ? 'border border-gray-200 dark:border-zinc-700 border-l-0 p-4' : '',
      v !== 'enclosed' && !isVert ? SIZE_PANEL_PT[s] : '',
      v !== 'enclosed' && isVert ? SIZE_PANEL_PL[s] : '',
    );

    // ---- Outer layout ----
    const outerClasses = cx(
      'flex',
      isVert ? 'flex-row' : 'flex-col',
    );

    return html`
      <div class=${outerClasses}>
        <div class=${tabListClasses} role="tablist" aria-orientation=${this.orientation} @keydown=${this._handleKeydown}>
          ${tabs.map((tab, index) => {
            const isActive = index === this.active;
            const isDisabled = disabled.has(index);
            const icon = this._cachedIcons.get(index);
            return html`
              <button
                class=${getTabClasses(index)}
                role="tab"
                aria-selected=${isActive ? 'true' : 'false'}
                aria-disabled=${isDisabled ? 'true' : 'false'}
                aria-controls=${`kb-tabpanel-${index}`}
                id=${`kb-tab-${index}`}
                tabindex=${isActive ? '0' : '-1'}
                @click=${() => this._handleTabClick(index)}
              >
                ${icon ? html`<span class=${SIZE_ICON[s]}>${icon}</span>` : nothing}
                ${tab}
              </button>
            `;
          })}
          ${showIndicator
            ? html`<div
                class=${cx(
                  'absolute transition-all duration-300 ease-out',
                  COLOR_INDICATOR[cs],
                  isVert ? SIZE_INDICATOR_W_VERT[s] : SIZE_INDICATOR_H[s],
                )}
                style=${indicatorStyle}
              ></div>`
            : nothing}
        </div>
        <div class=${cx(panelClasses, 'flex-1')} role="tabpanel" aria-labelledby=${`kb-tab-${this.active}`} id=${`kb-tabpanel-${this.active}`}>
          ${panels.map((panel, index) => html`
            <div
              style=${index === this.active ? '' : 'display:none'}
              class=${index === this.active ? 'animate-kb-fade-in' : ''}
            >
              ${panel}
            </div>
          `)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-tabs': KbTabs;
  }
}
