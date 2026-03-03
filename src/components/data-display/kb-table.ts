import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { SortDirection } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type TableVariant = 'simple' | 'striped' | 'bordered';
export type TableSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<
  TableSize,
  { cellPx: string; cellPy: string; headerPx: string; headerPy: string; text: string; toolbarPx: string }
> = {
  sm: {
    cellPx: 'px-4',
    cellPy: 'py-2.5',
    headerPx: 'px-4',
    headerPy: 'py-2.5',
    text: 'text-xs',
    toolbarPx: 'px-4 py-2.5',
  },
  md: { cellPx: 'px-5', cellPy: 'py-3.5', headerPx: 'px-5', headerPy: 'py-3', text: 'text-sm', toolbarPx: 'px-5 py-3' },
  lg: {
    cellPx: 'px-6',
    cellPy: 'py-4.5',
    headerPx: 'px-6',
    headerPy: 'py-4',
    text: 'text-[15px]',
    toolbarPx: 'px-6 py-4',
  },
} as const satisfies Record<
  TableSize,
  { cellPx: string; cellPy: string; headerPx: string; headerPy: string; text: string; toolbarPx: string }
>;

const HOVER_CLASSES: string = 'hover:bg-gray-50 dark:hover:bg-zinc-800/60';

const INTERACTIVE_ROW_CLASSES_LIST: string[] = [
  'cursor-pointer',
  'select-none',
  ...HOVER_CLASSES.split(' '),
  'active:bg-gray-100/80',
  'dark:active:bg-zinc-800',
  ...kbClasses.focus.split(' '),
  ...kbClasses.transitionColors.split(' '),
];

const SORT_INDICATOR_ATTR: string = 'data-kb-sort-indicator';
const RESIZE_HANDLE_ATTR: string = 'data-kb-resize-handle';

/** Classes applied directly to <th> elements — header styling. */
const TH_BASE_CLASSES: string[] = [
  'font-sans',
  'font-medium',
  'uppercase',
  'tracking-wider',
  'text-xs',
  'text-slate-500',
  'dark:text-zinc-400',
  'bg-gray-100',
  'dark:bg-zinc-800',
];

/** Classes applied to <td> elements — cell borders + alignment. */
const TD_BASE_CLASSES: string[] = ['align-middle', 'border-b', 'border-gray-200', 'dark:border-zinc-700'];

/** Classes applied to <tr> elements — transitions. */
const TR_BASE_CLASSES: string[] = ['transition-colors', 'duration-150', 'ease-in-out'];

/** Classes applied to <thead tr> — header bottom border. */
const THEAD_TR_CLASSES: string[] = ['border-b', 'border-gray-200', 'dark:border-zinc-700'];

/** Bordered variant: extra classes for <th> and <td>. */
const BORDERED_TH_CLASSES: string[] = ['border-r', 'border-gray-200', 'dark:border-zinc-700', 'last:border-r-0'];
const BORDERED_TD_CLASSES: string[] = ['border-r', 'border-gray-200', 'dark:border-zinc-700', 'last:border-r-0'];

/** Hover classes for non-interactive hoverable rows. */
const HOVER_ROW_CLASSES: string[] = ['hover:bg-gray-50', 'dark:hover:bg-zinc-800/60'];

/** Striped variant: even-row classes. */
const STRIPED_EVEN_CLASSES: string[] = ['even:bg-gray-50/50', 'dark:even:bg-zinc-800/30'];

let tableInstanceCounter = 0;

/**
 * Data table with sorting, searching, column resizing, and interactive rows.
 *
 * Renders inside a thin 1px border container with optional header background,
 * caption bar, search toolbar, and sticky header support.
 *
 * **Important**: The consumer must provide a `<table>` element as a direct child.
 * Table sub-elements (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`) are only valid
 * inside `<table>` per the HTML spec. Placing them directly inside a custom element
 * causes the browser's HTML parser to discard them in template-based frameworks
 * (e.g. Svelte).
 *
 * **Sortable**: header cells become clickable to sort rows. Use `data-sort="number"`
 * on a `<th>` for numeric sorting, or `data-no-sort` to exclude a column.
 *
 * **Searchable**: renders a search input that filters rows by text content.
 *
 * **Resizable**: adds drag handles to column edges for width adjustment.
 *
 * @slot - A `<table>` element containing `<thead>` and `<tbody>`.
 *
 * @fires kb-row-click - Interactive body row clicked/activated. `detail: { index: number; row: HTMLTableRowElement }`.
 * @fires kb-sort - Sort state changed. `detail: { column: number; direction: 'asc' | 'desc' }`.
 *
 * @example
 * ```html
 * <kb-table sortable searchable resizable variant="striped" caption="Services">
 *   <table>
 *     <thead>
 *       <tr>
 *         <th>Name</th>
 *         <th data-sort="number">Latency</th>
 *         <th data-no-sort>Actions</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       <tr><td>Auth</td><td>12</td><td>...</td></tr>
 *     </tbody>
 *   </table>
 * </kb-table>
 * ```
 */
export class KbTable extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** A-2: Unique id for the table element so search input can reference it via aria-controls. */
  private _tableId = `kb-table-${tableInstanceCounter++}`;

  /** Visual variant - `'simple'` (default lines), `'striped'` (alternating row bg), or `'bordered'` (cell borders). @defaultValue 'simple' */
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
  /** Text shown when no rows match the search query (or the table has no rows). @defaultValue 'No results' */
  @property({ type: String, attribute: 'empty-text' }) emptyText: string = 'No results';

  private _sortCol: number = -1;
  private _sortDir: SortDirection = 'asc';
  private _searchQuery: string = '';
  private _visibleCount: number = -1;
  private _totalCount: number = 0;
  private _countSpanRef: WeakRef<HTMLSpanElement> | null = null;
  private _emptyRow: HTMLTableRowElement | null = null;
  private _tbodyEl: HTMLTableSectionElement | null = null;
  private _tableEl: HTMLTableElement | null = null;

  private _boundRowHandlers = new WeakMap<
    HTMLTableRowElement,
    {
      click: () => void;
      keydown: (e: KeyboardEvent) => void;
    }
  >();

  private _cachedBodyRows: HTMLTableRowElement[] | null = null;
  private _cachedHeaderCells: HTMLTableCellElement[] | null = null;

  private _getBodyRows(): HTMLTableRowElement[] {
    if (this._cachedBodyRows === null) {
      this._cachedBodyRows = Array.from(
        this.querySelectorAll<HTMLTableRowElement>('tbody tr:not([data-kb-empty-row])'),
      );
    }
    return this._cachedBodyRows;
  }

  private _getHeaderCells(): HTMLTableCellElement[] {
    if (this._cachedHeaderCells === null) {
      this._cachedHeaderCells = Array.from(this.querySelectorAll<HTMLTableCellElement>('thead th'));
    }
    return this._cachedHeaderCells;
  }

  private _invalidateDomCaches(): void {
    this._cachedBodyRows = null;
    this._cachedHeaderCells = null;
  }

  override firstUpdated(): void {
    if (isServer) return;
    this._tableEl = this.querySelector('table');
    this._tbodyEl = this.querySelector('tbody');
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (isServer) return;
    if (changed.has('interactive') || changed.has('sortable') || changed.has('resizable')) {
      this._invalidateDomCaches();
    }
    this._syncTableElement();
    this._applyTableStyles();
    if (changed.has('interactive')) {
      this._applyInteractiveRows();
    }
    if (changed.has('sortable')) {
      this._applySortableHeaders();
    }
    if (changed.has('resizable')) {
      this._applyResizableColumns();
    }
    if (this._totalCount === 0 || changed.has('interactive')) {
      this._syncRowCounts();
    }
    this._syncEmptyText(changed);
    this._syncCountSpanRef();
  }

  /** Ensure the table element ref is current and apply id/classes. */
  private _syncTableElement(): void {
    if (!this._tableEl) this._tableEl = this.querySelector('table');
    if (this._tableEl) {
      this._tableEl.id = this._tableId;
      this._tableEl.className = this._computeTableClasses();
    }
  }

  /** Update the empty-row text when the `emptyText` property changes. */
  private _syncEmptyText(changed: Map<PropertyKey, unknown>): void {
    if (!(changed.has('emptyText') && this._emptyRow)) return;
    const td = this._emptyRow.querySelector('td');
    if (td) td.textContent = this.emptyText;
  }

  /** Lazily cache a WeakRef to the count <span> used by the search toolbar. */
  private _syncCountSpanRef(): void {
    if (!this.searchable || this._countSpanRef?.deref()) return;
    const span = this.querySelector<HTMLSpanElement>('[data-kb-count-span]');
    if (span) this._countSpanRef = new WeakRef(span);
  }

  override disconnectedCallback(): void {
    clearTimeout(this._searchTimeout);
    this._cleanupInteractiveRows();
    this._cleanupSortableHeaders();
    this._cleanupResizableColumns();
    this._emptyRow?.remove();
    this._emptyRow = null;
    super.disconnectedCallback();
    if (isServer) return;
  }

  private _applyInteractiveRows(): void {
    const rows = this._getBodyRows();

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
    for (const row of this._getBodyRows()) this._detachRow(row);
  }

  private _fireRowClick(index: number, row: HTMLTableRowElement): void {
    this.emit('kb-row-click', { index, row });
  }

  private _sortClickHandlers = new WeakMap<HTMLTableCellElement, () => void>();
  private _sortKeyDownHandlers = new WeakMap<HTMLTableCellElement, (e: KeyboardEvent) => void>();

  private _applySortableHeaders(): void {
    const headers = this._getHeaderCells();

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
        th.setAttribute('tabindex', '0');

        const clickHandler = (): void => this._handleSortClick(colIndex);
        const keyDownHandler = (e: KeyboardEvent): void => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._handleSortClick(colIndex);
          }
        };

        th.addEventListener('click', clickHandler);
        th.addEventListener('keydown', keyDownHandler);
        this._sortClickHandlers.set(th, clickHandler);
        this._sortKeyDownHandlers.set(th, keyDownHandler);
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
      th.removeAttribute('tabindex');
    }
    const keyDownHandler = this._sortKeyDownHandlers.get(th);
    if (keyDownHandler) {
      th.removeEventListener('keydown', keyDownHandler);
      this._sortKeyDownHandlers.delete(th);
    }
    const indicator = th.querySelector(`[${SORT_INDICATOR_ATTR}]`);
    indicator?.remove();
  }

  private _cleanupSortableHeaders(): void {
    for (const th of this._getHeaderCells()) this._detachSortHeader(th);
  }

  private _handleSortClick(colIndex: number): void {
    if (this._sortCol === colIndex) {
      this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortCol = colIndex;
      this._sortDir = 'asc';
    }

    this._performSort();
    this._applySortableHeaders();

    this.emit('kb-sort', { column: this._sortCol, direction: this._sortDir });
  }

  private _performSort(): void {
    const tbody = this._tbodyEl ?? this.querySelector('tbody');
    if (!tbody || this._sortCol < 0) return;

    const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr'));
    const col = this._sortCol;
    const dir = this._sortDir === 'asc' ? 1 : -1;

    const th = this._getHeaderCells()[col];
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

    const fragment = document.createDocumentFragment();
    for (const { row } of keyed) fragment.appendChild(row);
    tbody.appendChild(fragment);
  }

  private _updateSortIndicator(th: HTMLTableCellElement, colIndex: number): void {
    let indicator = th.querySelector(`[${SORT_INDICATOR_ATTR}]`) as HTMLSpanElement | null;

    if (this._sortCol !== colIndex) {
      if (indicator) {
        indicator.textContent = '';
        indicator.className = `ml-2 inline-block text-slate-300 dark:text-zinc-600 text-xs font-sans font-medium select-none ${kbClasses.transitionColors}`;
        indicator.textContent = '↕';
      } else {
        indicator = document.createElement('span');
        indicator.setAttribute(SORT_INDICATOR_ATTR, '');
        indicator.className = `ml-2 inline-block text-slate-300 dark:text-zinc-600 text-xs font-sans font-medium select-none ${kbClasses.transitionColors}`;
        indicator.textContent = '↕';
        th.appendChild(indicator);
      }
      th.setAttribute('aria-sort', 'none');
      return;
    }

    if (!indicator) {
      indicator = document.createElement('span');
      indicator.setAttribute(SORT_INDICATOR_ATTR, '');
      th.appendChild(indicator);
    }

    indicator.className = `ml-2 inline-block text-slate-800 dark:text-zinc-200 text-xs font-sans font-medium select-none ${kbClasses.transitionColors}`;
    indicator.textContent = this._sortDir === 'asc' ? '↑' : '↓';
    th.setAttribute('aria-sort', this._sortDir === 'asc' ? 'ascending' : 'descending');
  }

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
    const rows = this._getBodyRows();
    if (rows.length === 0) return;

    const query = this._searchQuery.toLowerCase().trim();

    if (!query) {
      this._rowTextCache = new WeakMap<HTMLTableRowElement, string>();
    }

    let visible = 0;
    for (const row of rows) {
      if (!query) {
        row.hidden = false;
        visible++;
        continue;
      }
      let text = this._rowTextCache.get(row);
      if (text === undefined) {
        text = (row.textContent ?? '').toLowerCase();
        this._rowTextCache.set(row, text);
      }
      const match = text.includes(query);
      row.hidden = !match;
      if (match) visible++;
    }

    this._visibleCount = visible;
    this._totalCount = rows.length;
    this._updateCountSpan();
    this._syncEmptyRow();
  }

  private _syncRowCounts(): void {
    const rows = this._getBodyRows();
    this._totalCount = rows.length;
    if (this._visibleCount < 0) {
      this._visibleCount = rows.length;
    }
    this._updateCountSpan();
    this._syncEmptyRow();
  }

  private _updateCountSpan(): void {
    const span = this._countSpanRef?.deref();
    if (!span) return;
    const showCount = this._searchQuery.trim() !== '';
    span.textContent = showCount ? `${this._visibleCount} of ${this._totalCount}` : `${this._totalCount} rows`;
  }

  private _syncEmptyRow(): void {
    const tbody = this._tbodyEl ?? this.querySelector('tbody');
    if (!tbody) return;

    const hasVisible = this._visibleCount > 0;

    if (hasVisible) {
      this._emptyRow?.remove();
      this._emptyRow = null;
      return;
    }

    if (!this._emptyRow) {
      const colCount = this._getHeaderCells().length || 1;
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = colCount;
      td.className = `py-8 text-center font-sans text-sm select-none ${kbClasses.textMuted}`;
      td.setAttribute('data-kb-empty-row', '');
      tr.setAttribute('data-kb-empty-row', '');
      tr.appendChild(td);
      this._emptyRow = tr;
    }

    const td = this._emptyRow.querySelector('td');
    if (td) td.textContent = this.emptyText;

    if (!this._emptyRow.parentElement) {
      tbody.appendChild(this._emptyRow);
    }
  }

  private _resizeHandles = new WeakMap<HTMLTableCellElement, HTMLDivElement>();
  private _resizeInitialized = false;

  private _applyResizableColumns(): void {
    const headers = this._getHeaderCells();
    const table = this.querySelector('table');

    if (!this.resizable || headers.length === 0 || !table) {
      this._cleanupResizableColumns();
      return;
    }

    if (!this._resizeInitialized) {
      const widths = headers.map((th) => th.getBoundingClientRect().width);
      headers.forEach((th, i) => {
        th.style.width = `${widths[i]}px`;
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
      handle.style.cssText = 'position:absolute;right:-4px;top:0;bottom:0;width:8px;cursor:col-resize;z-index:1;';
      handle.className = 'hover:bg-blue-500/40 active:bg-blue-500/60';

      handle.addEventListener('pointerdown', (e) => this._startResize(e, th));
      th.appendChild(handle);
      this._resizeHandles.set(th, handle);
    });
  }

  private _startResize(e: PointerEvent, th: HTMLTableCellElement): void {
    e.preventDefault();
    e.stopPropagation();

    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startWidth = th.getBoundingClientRect().width;
    const MIN_WIDTH = 40;

    const onMove = (ev: PointerEvent): void => {
      const delta = ev.clientX - startX;
      const newWidth = Math.max(MIN_WIDTH, startWidth + delta);
      th.style.width = `${newWidth}px`;
    };

    const onUp = (): void => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
    };

    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  }

  private _cleanupResizableColumns(): void {
    const headers = this._getHeaderCells();
    for (const th of headers) {
      const handle = this._resizeHandles.get(th);
      if (handle) {
        handle.remove();
        this._resizeHandles.delete(th);
      }
      th.style.width = '';
      th.style.position = '';
    }

    const table = this.querySelector('table');
    if (table) table.style.tableLayout = '';
    this._resizeInitialized = false;
  }

  private _computeTableClasses(): string {
    const sizeConfig = SIZE_MAP[this.size] ?? SIZE_MAP.md;

    return cx('w-full border-collapse text-left', kbClasses.textPrimary, sizeConfig.text);
  }

  /**
   * Apply styling classes directly to child <th>, <td>, <tr>, <thead> elements.
   *
   * Tailwind 4's content scanner cannot extract arbitrary-variant classes like
   * `[&_td]:px-5` from JS source, so they're never emitted in `dist/theme.css`.
   * Instead, we apply standard utility classes directly to child elements.
   */
  private _applyTableStyles(): void {
    const sizeConfig = SIZE_MAP[this.size] ?? SIZE_MAP.md;
    const isBordered = this.variant === 'bordered';

    this._styleHeaderCells(sizeConfig, isBordered);
    this._styleBodyCells(sizeConfig, isBordered);
    this._styleRows(sizeConfig);
  }

  /** Apply size and variant classes to <th> elements in <thead>. */
  private _styleHeaderCells(sizeConfig: (typeof SIZE_MAP)[TableSize], isBordered: boolean): void {
    const thElements = this.querySelectorAll<HTMLTableCellElement>('thead th');
    for (const th of thElements) {
      th.classList.add(sizeConfig.headerPx, sizeConfig.headerPy, ...TH_BASE_CLASSES);
      if (isBordered) th.classList.add(...BORDERED_TH_CLASSES);
    }
  }

  /** Apply size and variant classes to <td> elements and remove last-row border. */
  private _styleBodyCells(sizeConfig: (typeof SIZE_MAP)[TableSize], isBordered: boolean): void {
    const tdElements = this.querySelectorAll<HTMLTableCellElement>('tbody td');
    for (const td of tdElements) {
      td.classList.add(sizeConfig.cellPx, sizeConfig.cellPy, ...TD_BASE_CLASSES);
      if (isBordered) td.classList.add(...BORDERED_TD_CLASSES);
    }

    // Remove bottom border from last visible body row's <td> cells
    const bodyRows = this._getBodyRows();
    const lastRow = bodyRows[bodyRows.length - 1];
    if (lastRow) {
      for (const td of lastRow.querySelectorAll('td')) {
        td.classList.remove('border-b');
      }
    }
  }

  /** Apply transition, hover, striped, and sticky classes to row / thead elements. */
  private _styleRows(_sizeConfig: (typeof SIZE_MAP)[TableSize]): void {
    const hoverableRows = this.hoverable && !this.interactive;
    const isStriped = this.variant === 'striped';

    const theadRows = this.querySelectorAll<HTMLTableRowElement>('thead tr');
    for (const tr of theadRows) {
      tr.classList.add(...THEAD_TR_CLASSES);
    }

    const bodyRows = this._getBodyRows();
    for (const row of bodyRows) {
      row.classList.add(...TR_BASE_CLASSES);
      if (hoverableRows) row.classList.add(...HOVER_ROW_CLASSES);
      if (isStriped) row.classList.add(...STRIPED_EVEN_CLASSES);
    }

    if (this.stickyHeader) {
      const thead = this.querySelector('thead');
      if (thead) thead.classList.add('sticky', 'top-0', 'z-10');
    }
  }

  override render(): TemplateResult {
    const sizeConfig = SIZE_MAP[this.size] ?? SIZE_MAP.md;

    const containerClasses = this.buildClasses(
      kbClasses.border,
      kbClasses.surface,
      this.stickyHeader ? 'flex flex-col h-full overflow-hidden' : 'overflow-hidden',
    );

    const captionEl = this.caption
      ? html`<div class="shrink-0 ${sizeConfig.toolbarPx} ${kbClasses.borderBottom} font-sans font-medium text-sm text-slate-700 dark:text-zinc-300 select-none bg-gray-50/50 dark:bg-zinc-900/50">${this.caption}</div>`
      : nothing;

    const showCount = this.searchable && this._searchQuery.trim() !== '';
    const countText = showCount ? `${this._visibleCount} of ${this._totalCount}` : `${this._totalCount} rows`;

    const toolbarEl = this.searchable
      ? html`
        <div class="shrink-0 ${sizeConfig.toolbarPx} ${kbClasses.borderBottom} flex items-center gap-3 bg-white dark:bg-zinc-950">
          <svg aria-hidden="true" class="shrink-0 w-4 h-4 text-slate-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder=${this.searchPlaceholder}
            aria-label="Search table"
            aria-controls=${this._tableId}
            class="flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-sm ${kbClasses.textPrimary} placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            @input=${this._handleSearchInput}
          />
          <span data-kb-count-span class="shrink-0 font-sans text-xs font-medium text-slate-500 dark:text-zinc-400 select-none whitespace-nowrap">${countText}</span>
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
          ${this.defaultSlotContent}
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
