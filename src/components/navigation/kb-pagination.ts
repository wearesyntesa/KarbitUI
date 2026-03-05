import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { KbPageChangeDetail } from '../../core/events.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const paginationRecipe = recipe({
  base: cx('inline-flex items-center', kbClasses.transitionColors),
  variants: {
    size: {
      sm: 'gap-0.5 text-xs',
      md: 'gap-1 text-sm',
      lg: 'gap-1.5 text-base',
    },
  },
  defaultVariants: { size: 'md' },
});

export type PaginationSize = InferVariant<typeof paginationRecipe, 'size'>;

const BTN_SIZE: Record<PaginationSize, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
} as const satisfies Record<PaginationSize, string>;

const BTN_BASE: string = cx(
  'inline-flex items-center justify-center font-mono',
  kbClasses.border,
  kbClasses.transitionColors,
  kbClasses.focus,
  'cursor-pointer select-none',
);

const BTN_DEFAULT: string = cx(kbClasses.surface, kbClasses.textPrimary, 'hover:bg-gray-100 dark:hover:bg-zinc-800');

const BTN_ACTIVE: string =
  'bg-slate-900 text-white dark:bg-zinc-50 dark:text-zinc-900 border-slate-900 dark:border-zinc-50';

const BTN_DISABLED: string = 'opacity-40 cursor-not-allowed pointer-events-none';

const CHEVRON_LEFT: TemplateResult = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m15 18-6-6 6-6"/></svg>`;
const CHEVRON_RIGHT: TemplateResult = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m9 18 6-6-6-6"/></svg>`;

function buildPageRange(current: number, total: number, siblings: number): (number | 'ellipsis')[] {
  if (total <= 1) return [1];

  const pages: (number | 'ellipsis')[] = [];
  const left: number = Math.max(2, current - siblings);
  const right: number = Math.min(total - 1, current + siblings);

  pages.push(1);
  if (left > 2) pages.push('ellipsis');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('ellipsis');
  if (total > 1) pages.push(total);

  return pages;
}

/**
 * Page navigation controls for paginated content.
 *
 * Fires `kb-page-change` when the user selects a new page.
 *
 * @fires kb-page-change - Fired when the active page changes. `detail.page` is the 1-based page number.
 *
 * @example
 * ```html
 * <kb-pagination total="10" page="3"></kb-pagination>
 * <kb-pagination total="50" page="1" siblings="2" size="sm"></kb-pagination>
 * ```
 */
export class KbPagination extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Total number of pages. @defaultValue 1 */
  @property({ type: Number }) total: number = 1;
  /** Current active page (1-based). @defaultValue 1 */
  @property({ type: Number }) page: number = 1;
  /** Number of sibling pages to show around the current page. @defaultValue 1 */
  @property({ type: Number }) siblings: number = 1;
  /** Component size. @defaultValue 'md' */
  @property({ type: String }) size: PaginationSize = 'md';

  private _cachedRecipeClasses = '';

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this._cachedRecipeClasses === '' || changed.has('size')) {
      this._cachedRecipeClasses = paginationRecipe({ size: this.size });
    }
  }

  private _goTo(page: number): void {
    if (page < 1 || page > this.total || page === this.page) return;
    this.page = page;
    this.emit('kb-page-change', { page } satisfies KbPageChangeDetail);
  }

  private _renderButton(
    content: TemplateResult | string | number,
    page: number,
    isActive: boolean,
    isDisabled: boolean,
  ): TemplateResult {
    const sizeClass: string = BTN_SIZE[this.size] ?? BTN_SIZE.md;
    let stateClass: string;
    if (isDisabled) {
      stateClass = BTN_DISABLED;
    } else if (isActive) {
      stateClass = BTN_ACTIVE;
    } else {
      stateClass = BTN_DEFAULT;
    }

    return html`<button
			type="button"
			class="${BTN_BASE} ${sizeClass} ${stateClass}"
			?disabled=${isDisabled}
			aria-current=${isActive ? 'page' : nothing}
			@click=${(): void => this._goTo(page)}
		>${content}</button>`;
  }

  override render(): TemplateResult {
    const pages = buildPageRange(this.page, this.total, this.siblings);
    const classes = this.buildClasses(this._cachedRecipeClasses);
    const ellipsisClass = `${BTN_SIZE[this.size] ?? BTN_SIZE.md} inline-flex items-center justify-center ${kbClasses.textSecondary} select-none`;

    return html`<nav class=${classes} role="navigation" aria-label="Pagination">
			${this._renderButton(CHEVRON_LEFT, this.page - 1, false, this.page <= 1)}
			${pages.map((p) =>
        p === 'ellipsis'
          ? html`<span class=${ellipsisClass}>&hellip;</span>`
          : this._renderButton(p, p, p === this.page, false),
      )}
			${this._renderButton(CHEVRON_RIGHT, this.page + 1, false, this.page >= this.total)}
		</nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-pagination': KbPagination;
  }
}
