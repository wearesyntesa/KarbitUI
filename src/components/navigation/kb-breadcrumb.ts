import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { BreadcrumbItem, ComponentSize } from '../../core/types.js';
import { arrayHasChanged } from '../../utils/has-changed.js';

export type SeparatorType = 'chevron' | 'slash' | 'arrow' | 'dot' | 'pipe';

const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const satisfies Record<ComponentSize, string>;

const SIZE_GAP: Record<ComponentSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
} as const satisfies Record<ComponentSize, string>;

const SIZE_SEP: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-[1.125rem] h-[1.125rem]',
} as const satisfies Record<ComponentSize, string>;

const SIZE_ELLIPSIS_PY: Record<ComponentSize, string> = {
  xs: 'px-1 py-0',
  sm: 'px-1 py-0',
  md: 'px-1.5 py-0.5',
  lg: 'px-2 py-0.5',
  xl: 'px-2 py-1',
} as const satisfies Record<ComponentSize, string>;

const SEPARATOR_TYPES: ReadonlySet<string> = new Set(['chevron', 'slash', 'arrow', 'dot', 'pipe']);

function isSeparatorType(value: string): value is SeparatorType {
  return SEPARATOR_TYPES.has(value);
}

/**
 * Breadcrumb navigation with data-driven items, SVG separators, collapse,
 * and hover animations.
 *
 * @fires kb-navigate - Breadcrumb item clicked. Detail: `{ index: number; item: BreadcrumbItem }`.
 *
 * @example
 * ```html
 * <kb-breadcrumb .items=${[
 *   { label: 'Home', href: '/' },
 *   { label: 'Products', href: '/products' },
 *   { label: 'Current Page' },
 * ]}></kb-breadcrumb>
 * ```
 */
export class KbBreadcrumb extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Array of breadcrumb items. The last item is treated as the current page. @defaultValue [] */
  @property({ type: Array, hasChanged: arrayHasChanged }) items: BreadcrumbItem[] = [];
  /** Separator between items - a preset name (`'chevron'`, `'slash'`, `'arrow'`, `'dot'`, `'pipe'`) or any custom string. @defaultValue 'chevron' */
  @property({ type: String }) separator: string = 'chevron';
  /** Text and gap size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Maximum visible items before collapsing middle items behind an ellipsis button. `0` disables collapsing. @defaultValue 0 */
  @property({ type: Number, attribute: 'max-items' }) maxItems: number = 0;

  @state() private _expanded = false;

  /** R-8: Cached separator template, rebuilt only when `separator` or `size` changes. */
  private _cachedSeparator: TemplateResult | null = null;

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (this._cachedSeparator === null || changed.has('separator') || changed.has('size')) {
      this._cachedSeparator = this._buildSeparator();
    }
  }

  private _handleItemClick(index: number, item: BreadcrumbItem, e: Event): void {
    this.emit('kb-navigate', { index, item });

    if (!item.href) {
      e.preventDefault();
    }
  }

  private _handleNavClick(e: MouseEvent): void {
    const anchor = (e.target as Element).closest<HTMLAnchorElement>('a[data-kb-crumb-index]');
    if (!anchor) return;
    const index = Number(anchor.dataset.kbCrumbIndex);
    if (!Number.isFinite(index)) return;
    const item = this.items[index];
    if (!item) return;
    this._handleItemClick(index, item, e);
  }

  private _handleExpand(): void {
    this._expanded = true;
  }

  /** R-8: Build the separator template (called only when inputs change). */
  private _buildSeparator(): TemplateResult {
    const sepClasses = `flex-shrink-0 ${kbClasses.textMuted} select-none`;

    if (isSeparatorType(this.separator)) {
      switch (this.separator) {
        case 'chevron':
          return html`<span class=${sepClasses} aria-hidden="true"><svg class="${SIZE_SEP[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m9 18 6-6-6-6"/></svg></span>`;
        case 'arrow':
          return html`<span class=${sepClasses} aria-hidden="true"><svg class="${SIZE_SEP[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>`;
        case 'slash':
          return html`<span class="${sepClasses}" aria-hidden="true">/</span>`;
        case 'dot':
          return html`<span class="${sepClasses}" aria-hidden="true">\u00B7</span>`;
        case 'pipe':
          return html`<span class="${sepClasses}" aria-hidden="true">|</span>`;
      }
    }

    return html`<span class="${sepClasses}" aria-hidden="true">${this.separator}</span>`;
  }

  /** Returns the cached separator template. */
  private _renderSeparator(): TemplateResult {
    return this._cachedSeparator ?? this._buildSeparator();
  }

  private _renderItem(item: BreadcrumbItem, index: number, isCurrent: boolean): TemplateResult {
    if (isCurrent) {
      return html`<span
        class="font-semibold select-none ${kbClasses.textPrimary} truncate max-w-48"
        aria-current="page"
      >${item.label}</span>`;
    }

    return html`<a
      class="relative cursor-pointer ${kbClasses.textSecondary} ${kbClasses.hoverTextPrimary} active:opacity-70 ${kbClasses.transitionColors} group/crumb truncate max-w-48"
      href=${item.href ?? nothing}
      data-kb-crumb-index=${index}
    ><span>${item.label}</span><span class="absolute bottom-0 left-0 w-full h-px bg-current scale-x-0 group-hover/crumb:scale-x-100 transition-transform duration-200 ease-in-out origin-left"></span></a>`;
  }

  private _getVisibleItems(): { before: BreadcrumbItem[]; collapsed: BreadcrumbItem[]; after: BreadcrumbItem[] } {
    const items = this.items;
    const max = this.maxItems;

    if (max <= 0 || items.length <= max || this._expanded) {
      return { before: items, collapsed: [], after: [] };
    }

    if (max === 1) {
      return { before: [], collapsed: items.slice(0, -1), after: [items[items.length - 1] as BreadcrumbItem] };
    }

    const beforeCount = 1;
    const afterCount = max - 1;
    return {
      before: items.slice(0, beforeCount),
      collapsed: items.slice(beforeCount, items.length - afterCount),
      after: items.slice(items.length - afterCount),
    };
  }

  override render(): TemplateResult | typeof nothing {
    const navClasses = this.buildClasses('font-sans', SIZE_TEXT[this.size], kbClasses.textSecondary);

    const listClasses = `flex items-center flex-wrap ${SIZE_GAP[this.size]} list-none m-0 p-0`;

    const { before, collapsed, after } = this._getVisibleItems();
    const totalBefore = before.length;
    const totalCollapsed = collapsed.length;

    return this.items.length > 0
      ? html`<nav class=${navClasses} aria-label="Breadcrumb" @click=${this._handleNavClick}>
          <ol class=${listClasses}>
            ${repeat(
              before,
              (item) => item.href ?? item.label,
              (item, i) => html`<li class="flex items-center ${SIZE_GAP[this.size]}">
              ${i > 0 ? this._renderSeparator() : nothing}
              ${this._renderItem(item, i, i === this.items.length - 1)}
            </li>`,
            )}
            ${
              totalCollapsed > 0
                ? html`<li class="flex items-center ${SIZE_GAP[this.size]}">
              ${totalBefore > 0 ? this._renderSeparator() : nothing}
              <button
                class="cursor-pointer bg-transparent border ${kbClasses.borderColor} ${SIZE_ELLIPSIS_PY[this.size]} ${SIZE_TEXT[this.size]} ${kbClasses.textMuted} hover:text-slate-700 dark:hover:text-zinc-200 hover:border-gray-400 dark:hover:border-zinc-500 ${kbClasses.transitionColors} leading-none select-none"
                type="button"
                aria-label="Show ${totalCollapsed} more breadcrumb items"
                @click=${this._handleExpand}
              >\u2026</button>
            </li>`
                : nothing
            }
            ${repeat(
              after,
              (item) => item.href ?? item.label,
              (item, i) => {
                const globalIndex = totalBefore + totalCollapsed + i;
                return html`<li class="flex items-center ${SIZE_GAP[this.size]}">
                 ${this._renderSeparator()}
                 ${this._renderItem(item, globalIndex, globalIndex === this.items.length - 1)}
               </li>`;
              },
            )}
          </ol>
        </nav>`
      : nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-breadcrumb': KbBreadcrumb;
  }
}
