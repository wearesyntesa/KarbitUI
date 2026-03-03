import { type ComplexAttributeConverter, html, isServer, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import { ICON_SIZE } from '../../core/component-tokens.js';
import { kbClasses } from '../../core/theme.js';
import type { KnownColorScheme } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import { arrayHasChanged } from '../../utils/has-changed.js';

export type TabsVariant = 'line' | 'enclosed' | 'solid' | 'unstyled';
export type TabsSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsColorScheme = KnownColorScheme;
export type TabsAlign = 'start' | 'center' | 'end';

const SIZE_TEXT: Record<TabsSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
} as const satisfies Record<TabsSize, string>;

const SIZE_PX: Record<TabsSize, string> = {
  xs: 'px-2',
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-5',
  xl: 'px-6',
} as const satisfies Record<TabsSize, string>;

const SIZE_PY: Record<TabsSize, string> = {
  xs: 'py-1',
  sm: 'py-1.5',
  md: 'py-2',
  lg: 'py-2.5',
  xl: 'py-3',
} as const satisfies Record<TabsSize, string>;

const SIZE_GAP: Record<TabsSize, string> = {
  xs: 'gap-0.5',
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
  xl: 'gap-2.5',
} as const satisfies Record<TabsSize, string>;

const SIZE_PANEL_PT: Record<TabsSize, string> = {
  xs: 'pt-2',
  sm: 'pt-3',
  md: 'pt-4',
  lg: 'pt-5',
  xl: 'pt-6',
} as const satisfies Record<TabsSize, string>;

const SIZE_PANEL_PL: Record<TabsSize, string> = {
  xs: 'pl-2',
  sm: 'pl-3',
  md: 'pl-4',
  lg: 'pl-5',
  xl: 'pl-6',
} as const satisfies Record<TabsSize, string>;

const SIZE_INDICATOR_H: Record<TabsSize, string> = {
  xs: 'h-[1.5px]',
  sm: 'h-[1.5px]',
  md: 'h-0.5',
  lg: 'h-0.5',
  xl: 'h-[3px]',
} as const satisfies Record<TabsSize, string>;

const SIZE_INDICATOR_W_VERT: Record<TabsSize, string> = {
  xs: 'w-[1.5px]',
  sm: 'w-[1.5px]',
  md: 'w-0.5',
  lg: 'w-0.5',
  xl: 'w-[3px]',
} as const satisfies Record<TabsSize, string>;

const COLOR_ACTIVE_TEXT: Record<KnownColorScheme, string> = {
  blue: 'text-blue-500 dark:text-blue-400',
  red: 'text-red-500 dark:text-red-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  black: 'text-slate-900 dark:text-zinc-50',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_INDICATOR: Record<KnownColorScheme, string> = {
  blue: 'bg-blue-500 dark:bg-blue-400',
  red: 'bg-red-500 dark:bg-red-400',
  green: 'bg-green-600 dark:bg-green-400',
  yellow: 'bg-yellow-600 dark:bg-yellow-400',
  black: 'bg-slate-900 dark:bg-zinc-50',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_SOLID_ACTIVE_BG: Record<KnownColorScheme, string> = {
  blue: 'bg-blue-500 dark:bg-blue-600',
  red: 'bg-red-500 dark:bg-red-600',
  green: 'bg-green-600 dark:bg-green-700',
  yellow: 'bg-yellow-500 dark:bg-yellow-600',
  black: 'bg-slate-900 dark:bg-zinc-100',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_SOLID_ACTIVE_TEXT: Record<KnownColorScheme, string> = {
  blue: 'text-white',
  red: 'text-white',
  green: 'text-white',
  yellow: 'text-white',
  black: 'text-white dark:text-zinc-900',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_ENCLOSED_ACTIVE_BORDER: Record<KnownColorScheme, string> = {
  blue: 'border-t-blue-500 dark:border-t-blue-400',
  red: 'border-t-red-500 dark:border-t-red-400',
  green: 'border-t-green-600 dark:border-t-green-400',
  yellow: 'border-t-yellow-600 dark:border-t-yellow-400',
  black: 'border-t-slate-900 dark:border-t-zinc-50',
} as const satisfies Record<KnownColorScheme, string>;

const ALIGN_HORIZONTAL: Record<TabsAlign, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
} as const satisfies Record<TabsAlign, string>;

const ALIGN_VERTICAL: Record<TabsAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
} as const satisfies Record<TabsAlign, string>;

const disabledTabsConverter: ComplexAttributeConverter<number[]> = {
  fromAttribute(value: string | null): number[] {
    if (!value) return [];
    return value
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
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
export class KbTabs extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Zero-based index of the currently active tab. @defaultValue 0 */
  @property({ type: Number }) active: number = 0;
  /** Visual variant controlling tab styling - `'line'` (indicator bar), `'enclosed'` (bordered tabs), `'solid'` (filled background), or `'unstyled'`. @defaultValue 'line' */
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
  @property({ attribute: 'disabled-tabs', converter: disabledTabsConverter, hasChanged: arrayHasChanged })
  disabledTabs: number[] = [];
  /** Accessible label for the tab list (required when no visible heading labels the group). */
  @property({ type: String }) label: string = '';

  @state() private _indicatorPos: IndicatorPosition = { offset: 0, size: 0 };

  private _resizeObserver: ResizeObserver | null = null;
  private _childListObserver: MutationObserver | null = null;
  private _tabListEl: HTMLElement | null = null;
  private _tabButtons: HTMLButtonElement[] = [];
  private _disabledSet: Set<number> = new Set();
  private _cachedTabs: HTMLElement[] = [];
  private _cachedPanels: HTMLElement[] = [];
  private _cachedIcons: Map<number, HTMLElement> = new Map();
  private _pendingRecapture = false;

  /** Memoised class strings rebuilt in `willUpdate`. */
  private _tabListClasses = '';
  private _tabBaseClasses = '';
  private _panelClasses = '';
  /** Pre-computed per-tab classes for the 4 (active × disabled) combinations. */
  private _tabActiveEnabled = '';
  private _tabActiveDisabled = '';
  private _tabInactiveEnabled = '';
  private _tabInactiveDisabled = '';
  /** Suppresses the indicator slide transition until after first measurement. */
  private _indicatorInitialized = false;

  private get _isVertical(): boolean {
    return this.orientation === 'vertical';
  }

  private _recaptureSlotChildren(): void {
    this._cachedTabs = Array.from(this.querySelectorAll<HTMLElement>('[slot^="tab-"]'));
    this._cachedPanels = Array.from(this.querySelectorAll<HTMLElement>('[slot^="panel-"]'));
    this._cachedIcons = new Map();
    this._cachedTabs.forEach((_, i) => {
      const icon = this.querySelector<HTMLElement>(`[slot="icon-${i}"]`);
      if (icon) this._cachedIcons.set(i, icon);
    });
  }

  /** Coalesce multiple MutationObserver callbacks via microtask (R-6). */
  private _scheduleRecapture(): void {
    if (this._pendingRecapture) return;
    this._pendingRecapture = true;
    queueMicrotask(() => {
      this._pendingRecapture = false;
      this._recaptureSlotChildren();
      this.requestUpdate();
    });
  }

  override connectedCallback(): void {
    this._recaptureSlotChildren();
    super.connectedCallback();
    if (isServer) return;
    this._resizeObserver = new ResizeObserver(() => {
      this._measureIndicator();
    });
    this._childListObserver = new MutationObserver(() => {
      this._scheduleRecapture();
    });
    this._childListObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (isServer) return;
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._childListObserver?.disconnect();
    this._childListObserver = null;
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (changed.has('disabledTabs')) {
      this._disabledSet = new Set(this.disabledTabs);
    }
    // Memoize class strings when any dependency changes (R-4).
    const needsClassRebuild =
      changed.has('variant') ||
      changed.has('size') ||
      changed.has('colorScheme') ||
      changed.has('orientation') ||
      changed.has('fitted') ||
      changed.has('align') ||
      changed.has('active') ||
      changed.has('disabledTabs');

    if (needsClassRebuild) {
      this._tabListClasses = this._getTabListClasses();
      this._tabBaseClasses = this._getTabBaseClasses();
      this._panelClasses = this._getPanelClasses();
      this._rebuildTabClassCombinations();
    }
    if (changed.has('variant')) {
      this._syncResizeObserver();
    }
  }

  override firstUpdated(): void {
    if (isServer) return;
    this._tabListEl = this.querySelector<HTMLElement>('[role="tablist"]');
    this._syncResizeObserver();
    // Initial class memoization and indicator measurement (D-2).
    this._tabListClasses = this._getTabListClasses();
    this._tabBaseClasses = this._getTabBaseClasses();
    this._panelClasses = this._getPanelClasses();
    this._rebuildTabClassCombinations();
    this._measureIndicator();
    // Allow indicator transition only after initial measurement.
    this._indicatorInitialized = true;
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (isServer) return;
    if (changed.has('active')) {
      const prev = changed.get('active') as number;
      this._animatePanelExit(prev);
    }
    if (changed.has('active') || changed.has('orientation') || changed.has('variant') || changed.has('size')) {
      requestAnimationFrame(() => this._measureIndicator());
    }
  }

  /** Attach or detach the ResizeObserver based on whether the line indicator is needed. */
  private _syncResizeObserver(): void {
    if (this.variant === 'line' && this._tabListEl) {
      this._resizeObserver?.observe(this._tabListEl);
    } else {
      this._resizeObserver?.disconnect();
    }
  }

  private _measureIndicator(): void {
    const tabList = this._tabListEl ?? this.querySelector<HTMLElement>('[role="tablist"]');
    if (!tabList) return;

    this._tabButtons = Array.from(tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]'));

    const activeBtn = this._tabButtons[this.active];
    if (!activeBtn) return;

    const offset = this._isVertical ? activeBtn.offsetTop : activeBtn.offsetLeft;
    const size = this._isVertical ? activeBtn.offsetHeight : activeBtn.offsetWidth;

    if (this._indicatorPos.offset !== offset || this._indicatorPos.size !== size) {
      this._indicatorPos = { offset, size };
    }
  }

  private _animatePanelExit(prevIndex: number): void {
    if (prevIndex < 0 || prevIndex === this.active) return;
    const panelEl = this.querySelector<HTMLElement>(`#kb-tabpanel-${prevIndex}`);
    if (!panelEl || panelEl.hidden) return;
    const anim = panelEl.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: prefersReducedMotion() ? 0 : 120,
      easing: 'ease-out',
      fill: 'forwards',
    });
    anim.finished.then(
      () => {
        anim.commitStyles();
        anim.cancel();
      },
      (_e: unknown) => {
        /* cancelled - no-op */
      },
    );
  }

  private _handleTabListClick(e: MouseEvent): void {
    const btn = (e.target as Element).closest<HTMLButtonElement>('[role="tab"]');
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (!Number.isFinite(index)) return;
    if (this._disabledSet.has(index)) {
      e.preventDefault();
      return;
    }
    this._handleTabClick(index);
  }

  private _handleTabClick(index: number): void {
    if (this._disabledSet.has(index)) return;
    if (index === this.active) return;
    const previousIndex = this.active;
    this.active = index;
    this.emit('kb-tab-change', { index, previousIndex });
  }

  private _handleKeydown(e: KeyboardEvent): void {
    const tabs = this._tabButtons;
    if (tabs.length === 0) return;

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
      const idx = (((from + direction * i) % count) + count) % count;
      if (!disabled.has(idx)) return idx;
    }
    return;
  }

  private _getTabListClasses(): string {
    const isVert = this._isVertical;
    const v = this.variant;
    const alignClasses = isVert ? ALIGN_VERTICAL : ALIGN_HORIZONTAL;

    return cx(
      'relative flex',
      isVert ? 'flex-col' : 'flex-row',
      !this.fitted && alignClasses[this.align],
      v === 'line' && !isVert ? `border-b ${kbClasses.borderColor}` : '',
      v === 'line' && isVert ? `border-r ${kbClasses.borderColor}` : '',
      v === 'enclosed' && !isVert ? `border-b ${kbClasses.borderColor}` : '',
      v === 'enclosed' && isVert ? `border-r ${kbClasses.borderColor}` : '',
      v === 'solid' ? `${kbClasses.surfaceMuted} ${kbClasses.border} p-1 gap-1` : '',
    );
  }

  private _getTabBaseClasses(): string {
    const s = this.size;
    return cx(
      'relative inline-flex items-center uppercase tracking-widest cursor-pointer select-none',
      kbClasses.transitionColors,
      SIZE_TEXT[s],
      SIZE_PX[s],
      SIZE_PY[s],
      SIZE_GAP[s],
      kbClasses.focus,
    );
  }

  private _getLineTabClasses(base: string, isActive: boolean): string {
    const isVert = this._isVertical;
    const cs = this.colorScheme;
    return cx(
      base,
      !isVert && '-mb-px',
      isVert && '-mr-px',
      isActive ? COLOR_ACTIVE_TEXT[cs] : `${kbClasses.textSecondary} ${kbClasses.hoverTextPrimary}`,
    );
  }

  private _getEnclosedTabClasses(base: string, isActive: boolean): string {
    const isVert = this._isVertical;
    const cs = this.colorScheme;
    if (!isActive) {
      return cx(
        base,
        `border ${kbClasses.borderColor}`,
        !isVert && '-mb-px',
        isVert && '-mr-px',
        `${kbClasses.surfaceMuted} ${kbClasses.textSecondary} hover:bg-gray-100 dark:hover:bg-zinc-700 border-t-2 border-t-transparent`,
      );
    }
    return cx(
      base,
      `border ${kbClasses.borderColor}`,
      !isVert && '-mb-px',
      isVert && '-mr-px',
      'bg-white dark:bg-zinc-900 border-t-2',
      COLOR_ENCLOSED_ACTIVE_BORDER[cs],
      isVert ? '' : 'border-b-white dark:border-b-zinc-900',
      isVert ? 'border-r-white dark:border-r-zinc-900' : '',
      COLOR_ACTIVE_TEXT[cs],
    );
  }

  private _getSolidTabClasses(base: string, isActive: boolean): string {
    const cs = this.colorScheme;
    return cx(
      base,
      isActive
        ? cx(COLOR_SOLID_ACTIVE_BG[cs], COLOR_SOLID_ACTIVE_TEXT[cs])
        : `${kbClasses.textSecondary} hover:bg-gray-100 dark:hover:bg-zinc-700`,
    );
  }

  private _getTabClasses(isActive: boolean, isDisabled: boolean): string {
    if (isActive) return isDisabled ? this._tabActiveDisabled : this._tabActiveEnabled;
    return isDisabled ? this._tabInactiveDisabled : this._tabInactiveEnabled;
  }

  /** Pre-compute the 4 (active × disabled) class combinations once per update cycle. */
  private _rebuildTabClassCombinations(): void {
    this._tabActiveEnabled = this._buildTabClasses(true, false);
    this._tabActiveDisabled = this._buildTabClasses(true, true);
    this._tabInactiveEnabled = this._buildTabClasses(false, false);
    this._tabInactiveDisabled = this._buildTabClasses(false, true);
  }

  private _buildTabClasses(isActive: boolean, isDisabled: boolean): string {
    const v = this.variant;
    const tabBase = this._tabBaseClasses;

    const base = cx(tabBase, this.fitted && 'flex-1 text-center justify-center', isDisabled && kbClasses.disabledLook);

    if (v === 'line') return this._getLineTabClasses(base, isActive);
    if (v === 'enclosed') return this._getEnclosedTabClasses(base, isActive);
    if (v === 'solid') return this._getSolidTabClasses(base, isActive);

    return cx(base, isActive ? COLOR_ACTIVE_TEXT[this.colorScheme] : kbClasses.textSecondary);
  }

  private _getPanelClasses(): string {
    const isVert = this._isVertical;
    const v = this.variant;
    const s = this.size;
    return cx(
      'font-sans',
      kbClasses.textPrimary,
      v === 'enclosed' && !isVert ? `border ${kbClasses.borderColor} border-t-0 p-4` : '',
      v === 'enclosed' && isVert ? `border ${kbClasses.borderColor} border-l-0 p-4` : '',
      v !== 'enclosed' && !isVert ? SIZE_PANEL_PT[s] : '',
      v !== 'enclosed' && isVert ? SIZE_PANEL_PL[s] : '',
    );
  }

  private _renderIndicator(show: boolean): TemplateResult | typeof nothing {
    if (!show) return nothing;
    const isVert = this._isVertical;
    const s = this.size;
    const cs = this.colorScheme;
    const indicatorStyle = isVert
      ? `top:0;transform:translateY(${this._indicatorPos.offset}px);height:${this._indicatorPos.size}px;right:0;`
      : `left:0;transform:translateX(${this._indicatorPos.offset}px);width:${this._indicatorPos.size}px;bottom:0;`;

    return html`<div
      class=${cx(
        'absolute',
        this._indicatorInitialized ? 'transition-[transform] duration-300 ease-out' : '',
        COLOR_INDICATOR[cs],
        isVert ? SIZE_INDICATOR_W_VERT[s] : SIZE_INDICATOR_H[s],
      )}
      style=${indicatorStyle}
    ></div>`;
  }

  override render(): TemplateResult {
    const tabs = this._cachedTabs;
    const panels = this._cachedPanels;
    const disabled = this._disabledSet;
    const isVert = this._isVertical;
    const s = this.size;

    const tabListClasses = this._tabListClasses;
    const showIndicator = this.variant === 'line' && this._indicatorPos.size > 0;
    const panelClasses = this._panelClasses;
    const outerClasses = cx('flex', isVert ? 'flex-row' : 'flex-col');

    return html`
      <div class=${outerClasses}>
        <div class=${tabListClasses} role="tablist" aria-orientation=${this.orientation} aria-label=${this.label || nothing} @keydown=${this._handleKeydown} @click=${this._handleTabListClick}>
          ${repeat(
            tabs,
            (tab) => tab,
            (tab, index) => {
              const isActive = index === this.active;
              const isDisabled = disabled.has(index);
              const icon = this._cachedIcons.get(index);
              return html`
              <button
                class=${this._getTabClasses(isActive, isDisabled)}
                role="tab"
                aria-selected=${isActive ? 'true' : 'false'}
                aria-disabled=${isDisabled ? 'true' : 'false'}
                aria-controls=${`kb-tabpanel-${index}`}
                id=${`kb-tab-${index}`}
                tabindex=${isActive ? '0' : '-1'}
                data-index=${index}
              >
                ${icon ? html`<span class=${ICON_SIZE[s]}>${icon}</span>` : nothing}
                ${tab}
              </button>
            `;
            },
          )}
          ${this._renderIndicator(showIndicator)}
        </div>
        <div class=${cx(isVert ? 'flex-1' : '')}>
          ${repeat(
            panels,
            (panel) => panel,
            (panel, index) => html`
            <div
              role="tabpanel"
              id=${`kb-tabpanel-${index}`}
              aria-labelledby=${`kb-tab-${index}`}
              class=${cx(panelClasses, index === this.active ? 'animate-kb-fade-in' : '')}
              ?hidden=${index !== this.active}
            >
              ${panel}
            </div>
          `,
          )}
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
