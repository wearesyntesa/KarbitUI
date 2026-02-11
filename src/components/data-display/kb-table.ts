import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { SortDirection } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type TableVariant = 'simple' | 'striped' | 'bordered';
export type TableSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<
  TableSize,
  { cell: string; header: string; text: string; headerText: string; toolbarPx: string }
> = {
  sm: {
    cell: 'px-5 py-3.5',
    header: 'px-5 py-3.5',
    text: 'text-sm',
    headerText: 'text-[11px]',
    toolbarPx: 'px-5 py-3',
  },
  md: { cell: 'px-6 py-5', header: 'px-6 py-4', text: 'text-[15px]', headerText: 'text-xs', toolbarPx: 'px-6 py-4' },
  lg: { cell: 'px-8 py-6', header: 'px-8 py-5', text: 'text-base', headerText: 'text-xs', toolbarPx: 'px-8 py-5' },
} as const satisfies Record<
  TableSize,
  { cell: string; header: string; text: string; headerText: string; toolbarPx: string }
>;

const HOVER_CLASSES: string = 'hover:bg-gray-50/80 dark:hover:bg-zinc-800/50';

const INTERACTIVE_ROW_CLASSES_LIST: string[] = [
  'cursor-pointer',
  'select-none',
  ...HOVER_CLASSES.split(' '),
  'active:bg-gray-100/60',
  'dark:active:bg-zinc-800/70',
  ...kbClasses.focus.split(' '),
  ...kbClasses.transition.split(' '),
];

const SORT_INDICATOR_ATTR: string = 'data-kb-sort-indicator';
const RESIZE_HANDLE_ATTR: string = 'data-kb-resize-handle';

const VARIANT_CLASSES: Record<TableVariant, string> = {
  simple: '',
  striped:
    '[&_tbody_tr:nth-child(even):not([hidden])]:bg-gray-50/50 dark:[&_tbody_tr:nth-child(even):not([hidden])]:bg-zinc-800/30',
  bordered:
    '[&_th]:border [&_th]:border-gray-200 dark:[&_th]:border-zinc-700 [&_td]:border [&_td]:border-gray-200 dark:[&_td]:border-zinc-700',
} as const satisfies Record<TableVariant, string>;

/**
 * Data table with sorting, searching, column resizing, and interactive rows.
 *
 * Renders inside a thin 1px border container with optional header background,
 * caption bar, search toolbar, and sticky header support.
 *
 * **Sortable**: header cells become clickable to sort rows. Use `data-sort="number"`
 * on a `<th>` for numeric sorting, or `data-no-sort` to exclude a column.
 *
 * **Searchable**: renders a search input that filters rows by text content.
 *
 * **Resizable**: adds drag handles to column edges for width adjustment.
 *
 * @slot - Table content (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`).
 *
 * @fires kb-row-click - Interactive body row clicked/activated. `detail: { index: number; row: HTMLTableRowElement }`.
 * @fires kb-sort - Sort state changed. `detail: { column: number; direction: 'asc' | 'desc' }`.
 *
 * @example
 * ```html
 * <kb-table sortable searchable resizable variant="striped" caption="Services">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th data-sort="number">Latency</th>
 *       <th data-no-sort>Actions</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr><td>Auth</td><td>12</td><td>...</td></tr>
 *   </tbody>
 * </kb-table>
 * ```
 */
@customElement('kb-table')
export class KbTable extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Visual variant — `'simple'` (default lines), `'striped'` (alternating row bg), or `'bordered'` (cell borders). @defaultValue 'simple' */
  @property({ type: String }) variant: TableVariant = 'simple';
  /** Cell and header padding size. @defaultValue 'md' */
  @property({ type: String }) size: TableSize = 'md';
  /** Highlight rows on hover. @defaultValue true */
  @property({ type: Boolean }) hoverable: boolean = true;
  /** Make body rows clickable/focusable and emit `kb-row-click` events. @defaultValue false */
  @property({ type: Boolean }) interactive: boolean = false;
  /** Stick the `<thead>` to the top of the scroll container. @defaultValue false */
  @property({ type: Boolean, attribute: 'sticky-header' }) stickyHeader: boolean = false;
  /** Caption text shown in a labeled bar above the table. @defaultValue '' */
  @property({ type: String }) caption: string = '';
  /** Enable click-to-sort on header cells (use `data-no-sort` on a `<th>` to opt out). @defaultValue false */
  @property({ type: Boolean }) sortable: boolean = false;
  /** Show a search toolbar that filters rows by text content. @defaultValue false */
  @property({ type: Boolean }) searchable: boolean = false;
  /** Enable column-edge drag handles for width adjustment. @defaultValue false */
  @property({ type: Boolean }) resizable: boolean = false;
  /** Placeholder text shown in the search input. @defaultValue 'Search...' */
  @property({ type: String, attribute: 'search-placeholder' }) searchPlaceholder: string = 'Search...';

  @state() private _sortCol: number = -1;
  @state() private _sortDir: SortDirection = 'asc';
  @state() private _searchQuery: string = '';
  @state() private _visibleCount: number = -1;
  @state() private _totalCount: number = 0;

  // ── Interactive rows ──────────────────────────────────────────────

  private _boundRowHandlers = new WeakMap<
    HTMLTableRowElement,
    {
      click: () => void;
      keydown: (e: KeyboardEvent) => void;
    }
  >();

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('interactive')) {
      this._applyInteractiveRows();
    }
    if (changed.has('sortable') || changed.has('_sortCol') || changed.has('_sortDir')) {
      this._applySortableHeaders();
    }
    if (changed.has('resizable')) {
      this._applyResizableColumns();
    }
    if (this._totalCount === 0 || changed.has('_searchQuery') || changed.has('interactive')) {
      this._syncRowCounts();
    }
  }

  override disconnectedCallback(): void {
    this._cleanupInteractiveRows();
    this._cleanupSortableHeaders();
    this._cleanupResizableColumns();
    super.disconnectedCallback();
  }

  private _applyInteractiveRows(): void {
    const rows = this.querySelectorAll<HTMLTableRowElement>('tbody tr');

    if (!this.interactive) {
      for (const row of rows) this._detachRow(row);
      return;
    }

    rows.forEach((row, index) => {
      if (this._boundRowHandlers.has(row)) return;

      row.setAttribute('tabindex', '0');
      row.setAttribute('role', 'row');
      row.classList.add(...INTERACTIVE_ROW_CLASSES_LIST);

      const handlers = {
        click: () => this._fireRowClick(index, row),
        keydown: (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._fireRowClick(index, row);
          }
        },
      };

      row.addEventListener('click', handlers.click);
      row.addEventListener('keydown', handlers.keydown);
      this._boundRowHandlers.set(row, handlers);
    });
  }

  private _detachRow(row: HTMLTableRowElement): void {
    const handlers = this._boundRowHandlers.get(row);
    if (!handlers) return;

    row.removeAttribute('tabindex');
    row.removeAttribute('role');
    for (const cls of INTERACTIVE_ROW_CLASSES_LIST) row.classList.remove(cls);
    row.removeEventListener('click', handlers.click);
    row.removeEventListener('keydown', handlers.keydown);
    this._boundRowHandlers.delete(row);
  }

  private _cleanupInteractiveRows(): void {
    for (const row of this.querySelectorAll<HTMLTableRowElement>('tbody tr')) this._detachRow(row);
  }

  private _fireRowClick(index: number, row: HTMLTableRowElement): void {
    this.emit('kb-row-click', { index, row });
  }

  // ── Sortable ──────────────────────────────────────────────────────

  private _sortClickHandlers = new WeakMap<HTMLTableCellElement, () => void>();

  private _applySortableHeaders(): void {
    const headers = Array.from(this.querySelectorAll<HTMLTableCellElement>('thead th'));

    if (!this.sortable) {
      for (const th of headers) this._detachSortHeader(th);
      return;
    }

    headers.forEach((th, colIndex) => {
      if (th.hasAttribute('data-no-sort')) {
        this._detachSortHeader(th);
        return;
      }

      if (!this._sortClickHandlers.has(th)) {
        th.style.cursor = 'pointer';
        th.style.userSelect = 'none';
        th.style.position = 'relative';

        const handler = (): void => this._handleSortClick(colIndex);
        th.addEventListener('click', handler);
        this._sortClickHandlers.set(th, handler);
      }

      this._updateSortIndicator(th, colIndex);
    });
  }

  private _detachSortHeader(th: HTMLTableCellElement): void {
    const handler = this._sortClickHandlers.get(th);
    if (handler) {
      th.removeEventListener('click', handler);
      this._sortClickHandlers.delete(th);
      th.style.cursor = '';
      th.style.userSelect = '';
    }
    const indicator = th.querySelector(`[${SORT_INDICATOR_ATTR}]`);
    indicator?.remove();
  }

  private _cleanupSortableHeaders(): void {
    for (const th of this.querySelectorAll<HTMLTableCellElement>('thead th')) this._detachSortHeader(th);
  }

  private _handleSortClick(colIndex: number): void {
    if (this._sortCol === colIndex) {
      this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortCol = colIndex;
      this._sortDir = 'asc';
    }

    this._performSort();

    this.emit('kb-sort', { column: this._sortCol, direction: this._sortDir });
  }

  private _performSort(): void {
    const tbody = this.querySelector('tbody');
    if (!tbody || this._sortCol < 0) return;

    const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr'));
    const col = this._sortCol;
    const dir = this._sortDir === 'asc' ? 1 : -1;

    const th = this.querySelectorAll<HTMLTableCellElement>('thead th')[col];
    const isNumeric = th?.getAttribute('data-sort') === 'number';
    const numRegex = /[^0-9.-]/g;

    const keyed = rows.map((row) => {
      const text = (row.cells[col]?.textContent ?? '').trim();
      return { row, key: isNumeric ? parseFloat(text.replace(numRegex, '')) || 0 : text };
    });

    keyed.sort((a, b) =>
      isNumeric
        ? ((a.key as number) - (b.key as number)) * dir
        : (a.key as string).localeCompare(b.key as string) * dir,
    );

    for (const { row } of keyed) tbody.appendChild(row);
  }

  private _updateSortIndicator(th: HTMLTableCellElement, colIndex: number): void {
    let indicator = th.querySelector(`[${SORT_INDICATOR_ATTR}]`) as HTMLSpanElement | null;

    if (this._sortCol !== colIndex) {
      if (indicator) {
        indicator.textContent = '';
        indicator.className = `ml-2 inline-block text-slate-200 dark:text-zinc-700 text-[10px] font-mono ${kbClasses.transition}`;
        indicator.textContent = '↕';
      } else {
        indicator = document.createElement('span');
        indicator.setAttribute(SORT_INDICATOR_ATTR, '');
        indicator.className = `ml-2 inline-block text-slate-200 dark:text-zinc-700 text-[10px] font-mono ${kbClasses.transition}`;
        indicator.textContent = '↕';
        th.appendChild(indicator);
      }
      return;
    }

    if (!indicator) {
      indicator = document.createElement('span');
      indicator.setAttribute(SORT_INDICATOR_ATTR, '');
      th.appendChild(indicator);
    }

    indicator.className = `ml-2 inline-block text-blue-500 dark:text-blue-400 text-[10px] font-mono ${kbClasses.transition}`;
    indicator.textContent = this._sortDir === 'asc' ? '↑' : '↓';
  }

  // ── Searchable ────────────────────────────────────────────────────

  private _searchTimeout: ReturnType<typeof setTimeout> | undefined;
  private _rowTextCache = new WeakMap<HTMLTableRowElement, string>();

  private _handleSearchInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(() => {
      this._searchQuery = value;
      this._filterRows();
    }, 150);
  }

  private _filterRows(): void {
    const tbody = this.querySelector('tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll<HTMLTableRowElement>('tr');
    const query = this._searchQuery.toLowerCase().trim();

    let visible = 0;
    rows.forEach((row) => {
      if (!query) {
        row.hidden = false;
        visible++;
        return;
      }
      let text = this._rowTextCache.get(row);
      if (text === undefined) {
        text = (row.textContent ?? '').toLowerCase();
        this._rowTextCache.set(row, text);
      }
      const match = text.includes(query);
      row.hidden = !match;
      if (match) visible++;
    });

    this._visibleCount = visible;
    this._totalCount = rows.length;
  }

  private _syncRowCounts(): void {
    const rows = this.querySelectorAll<HTMLTableRowElement>('tbody tr');
    this._totalCount = rows.length;
    if (this._visibleCount < 0) {
      this._visibleCount = rows.length;
    }
  }

  // ── Resizable ─────────────────────────────────────────────────────

  private _resizeHandles = new WeakMap<HTMLTableCellElement, HTMLDivElement>();
  private _resizeInitialized = false;

  private _applyResizableColumns(): void {
    const headers = Array.from(this.querySelectorAll<HTMLTableCellElement>('thead th'));
    const table = this.querySelector('table');

    if (!this.resizable || headers.length === 0 || !table) {
      this._cleanupResizableColumns();
      return;
    }

    if (!this._resizeInitialized) {
      headers.forEach((th) => {
        const width = th.getBoundingClientRect().width;
        th.style.width = `${width}px`;
      });
      table.style.tableLayout = 'fixed';
      this._resizeInitialized = true;
    }

    headers.forEach((th, index) => {
      if (index === headers.length - 1) return;
      if (this._resizeHandles.has(th)) return;

      th.style.position = 'relative';

      const handle = document.createElement('div');
      handle.setAttribute(RESIZE_HANDLE_ATTR, '');
      handle.style.cssText = 'position:absolute;right:-1px;top:0;bottom:0;width:3px;cursor:col-resize;z-index:1;';
      handle.className = 'hover:bg-blue-500/40 active:bg-blue-500/60';

      handle.addEventListener('mousedown', (e) => this._startResize(e, th));
      th.appendChild(handle);
      this._resizeHandles.set(th, handle);
    });
  }

  private _startResize(e: MouseEvent, th: HTMLTableCellElement): void {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = th.getBoundingClientRect().width;
    const MIN_WIDTH = 40;

    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: MouseEvent): void => {
      const delta = ev.clientX - startX;
      const newWidth = Math.max(MIN_WIDTH, startWidth + delta);
      th.style.width = `${newWidth}px`;
    };

    const onUp = (): void => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  private _cleanupResizableColumns(): void {
    const headers = this.querySelectorAll<HTMLTableCellElement>('thead th');
    headers.forEach((th) => {
      const handle = this._resizeHandles.get(th);
      if (handle) {
        handle.remove();
        this._resizeHandles.delete(th);
      }
      th.style.width = '';
      th.style.position = '';
    });

    const table = this.querySelector('table');
    if (table) table.style.tableLayout = '';
    this._resizeInitialized = false;
  }

  // ── Render ────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const sizeConfig = SIZE_MAP[this.size] ?? SIZE_MAP.md;

    const hoverClasses =
      this.hoverable && !this.interactive
        ? '[&_tbody_tr:hover]:bg-gray-50/80 dark:[&_tbody_tr:hover]:bg-zinc-800/50'
        : '';

    const stickyClasses = this.stickyHeader
      ? '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead_th]:bg-white dark:[&_thead_th]:bg-zinc-900'
      : '';

    const cellBorderClasses =
      this.variant === 'bordered'
        ? ''
        : '[&_td]:border-b [&_td]:border-gray-100 dark:[&_td]:border-zinc-800 [&_tbody_tr:last-child_td]:border-b-0';

    const headerBorderClasses =
      this.variant === 'bordered'
        ? ''
        : '[&_thead_tr]:border-b [&_thead_tr]:border-gray-200 dark:[&_thead_tr]:border-zinc-700';

    const tableClasses = cx(
      'w-full border-collapse',
      kbClasses.textPrimary,
      sizeConfig.text,
      VARIANT_CLASSES[this.variant] ?? '',
      cellBorderClasses,
      headerBorderClasses,
      `[&_th]:${sizeConfig.header} [&_th]:text-left [&_th]:font-mono [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-widest [&_th]:${sizeConfig.headerText}`,
      '[&_th]:text-slate-400 dark:[&_th]:text-zinc-500',
      `[&_td]:${sizeConfig.cell}`,
      `[&_tr]:${kbClasses.transition}`,
      hoverClasses,
      stickyClasses,
    );

    const containerClasses = this.buildClasses(
      kbClasses.border,
      kbClasses.surface,
      this.stickyHeader ? 'flex flex-col h-full overflow-hidden' : 'overflow-hidden',
    );

    const captionEl = this.caption
      ? html`<div class="shrink-0 ${sizeConfig.toolbarPx} ${kbClasses.borderBottom} ${kbClasses.label}">${this.caption}</div>`
      : nothing;

    const showCount = this.searchable && this._searchQuery.trim() !== '';
    const countText = showCount ? `${this._visibleCount} of ${this._totalCount}` : `${this._totalCount} rows`;

    const toolbarEl = this.searchable
      ? html`
        <div class="shrink-0 ${sizeConfig.toolbarPx} ${kbClasses.borderBottom} flex items-center gap-4">
          <div class="relative flex-1 max-w-sm">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-zinc-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder=${this.searchPlaceholder}
              class="w-full pl-10 pr-4 py-2 text-sm font-sans ${kbClasses.border} ${kbClasses.surface} ${kbClasses.textPrimary} placeholder:${kbClasses.textMuted} ${kbClasses.focus} ${kbClasses.transition} outline-none"
              @input=${this._handleSearchInput}
            />
          </div>
          <span class="font-mono text-[11px] tracking-widest uppercase ${kbClasses.textMuted} whitespace-nowrap">${countText}</span>
        </div>
      `
      : nothing;

    const innerClasses = cx(
      this.stickyHeader ? 'flex-1 min-h-0 overflow-y-auto' : '',
      this.resizable ? 'overflow-x-auto' : '',
    );

    return html`
      <div class=${containerClasses}>
        ${captionEl}
        ${toolbarEl}
        <div class=${innerClasses || nothing}>
          <table class=${tableClasses}>${this.defaultSlotContent}</table>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-table': KbTable;
  }
}
