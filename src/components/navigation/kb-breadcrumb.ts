import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import type { KbNavigateDetail } from '../../core/events.js';

/** Single breadcrumb item. Last item in the array is treated as current page. */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type SeparatorType = 'chevron' | 'slash' | 'arrow' | 'dot' | 'pipe';

const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

const SIZE_GAP: Record<ComponentSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
};

const SIZE_SEP: Record<ComponentSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-4.5 h-4.5',
};

const SIZE_ELLIPSIS_PY: Record<ComponentSize, string> = {
  xs: 'px-1 py-0',
  sm: 'px-1 py-0',
  md: 'px-1.5 py-0.5',
  lg: 'px-2 py-0.5',
  xl: 'px-2 py-1',
};

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
@customElement('kb-breadcrumb')
export class KbBreadcrumb extends KbBaseElement {
  static override hostDisplay = 'block';

  /** Array of breadcrumb items. The last item is treated as the current page. @defaultValue [] */
  @property({ type: Array }) items: BreadcrumbItem[] = [];
  /** Separator between items — a preset name (`'chevron'`, `'slash'`, `'arrow'`, `'dot'`, `'pipe'`) or any custom string. @defaultValue 'chevron' */
  @property({ type: String }) separator: string = 'chevron';
  /** Text and gap size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Maximum visible items before collapsing middle items behind an ellipsis button. `0` disables collapsing. @defaultValue 0 */
  @property({ type: Number, attribute: 'max-items' }) maxItems: number = 0;

  @state() private _expanded = false;

  private _handleItemClick(index: number, item: BreadcrumbItem, e: Event): void {
    this.dispatchEvent(new CustomEvent<KbNavigateDetail>('kb-navigate', {
      detail: { index, item },
      bubbles: true,
      composed: true,
    }));

    if (!item.href) {
      e.preventDefault();
    }
  }

  private _handleExpand(): void {
    this._expanded = true;
  }

  private _renderSeparator() {
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

  private _renderItem(item: BreadcrumbItem, index: number, isCurrent: boolean) {
    if (isCurrent) {
      return html`<span
        class="font-semibold ${kbClasses.textPrimary} truncate max-w-48"
        aria-current="page"
      >${item.label}</span>`;
    }

    return html`<a
      class="relative cursor-pointer ${kbClasses.textSecondary} hover:text-slate-900 dark:hover:text-zinc-50 active:opacity-70 ${kbClasses.transition} group/crumb truncate max-w-48"
      href=${item.href ?? 'javascript:void(0)'}
      @click=${(e: Event) => this._handleItemClick(index, item, e)}
    ><span>${item.label}</span><span class="absolute bottom-0 left-0 w-full h-px bg-current scale-x-0 group-hover/crumb:scale-x-100 transition-transform duration-200 origin-left"></span></a>`;
  }

  private _getVisibleItems(): { before: BreadcrumbItem[]; collapsed: BreadcrumbItem[]; after: BreadcrumbItem[] } {
    const items = this.items;
    const max = this.maxItems;

    if (max <= 0 || items.length <= max || this._expanded) {
      return { before: items, collapsed: [], after: [] };
    }

    if (max === 1) {
      return { before: [], collapsed: items.slice(0, -1), after: [items[items.length - 1]] };
    }

    const beforeCount = 1;
    const afterCount = max - 1;
    return {
      before: items.slice(0, beforeCount),
      collapsed: items.slice(beforeCount, items.length - afterCount),
      after: items.slice(items.length - afterCount),
    };
  }

  override render() {
    const navClasses = this.buildClasses(
      'flex items-center flex-wrap font-sans',
      SIZE_TEXT[this.size],
      SIZE_GAP[this.size],
      kbClasses.textSecondary,
    );

    const { before, collapsed, after } = this._getVisibleItems();
    const totalBefore = before.length;
    const totalCollapsed = collapsed.length;
    const sep = this._renderSeparator();

    const parts: unknown[] = [];

    before.forEach((item, i) => {
      if (i > 0) parts.push(sep);
      const globalIndex = i;
      parts.push(this._renderItem(item, globalIndex, globalIndex === this.items.length - 1));
    });

    if (totalCollapsed > 0) {
      if (totalBefore > 0) parts.push(sep);
      parts.push(html`<button
        class="cursor-pointer bg-transparent border border-gray-200 dark:border-zinc-700 ${SIZE_ELLIPSIS_PY[this.size]} ${SIZE_TEXT[this.size]} ${kbClasses.textMuted} hover:text-slate-700 dark:hover:text-zinc-200 hover:border-gray-400 dark:hover:border-zinc-500 ${kbClasses.transition} font-mono leading-none select-none"
        type="button"
        aria-label="Show ${totalCollapsed} more breadcrumb items"
        @click=${() => this._handleExpand()}
      >\u2026</button>`);
    }

    after.forEach((item, i) => {
      parts.push(sep);
      const globalIndex = totalBefore + totalCollapsed + i;
      parts.push(this._renderItem(item, globalIndex, globalIndex === this.items.length - 1));
    });

    return this.items.length > 0
      ? html`<nav class=${navClasses} aria-label="Breadcrumb">${parts}</nav>`
      : nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-breadcrumb': KbBreadcrumb;
  }
}
