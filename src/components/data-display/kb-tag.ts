import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement, dismissWithAnimation } from '../../core/base-element.js';
import { STATIC_SOLID, STATIC_OUTLINE, STATIC_SUBTLE, BG_COLOR, lookupScheme } from '../../core/color-schemes.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme } from '../../core/types.js';

export type TagVariant = 'solid' | 'outline' | 'subtle';
export type TagSize = 'sm' | 'md' | 'lg';

const tagRecipe = recipe({
  base: 'inline-flex items-center font-mono font-semibold uppercase tracking-widest whitespace-nowrap select-none',
  variants: {
    variant: {
      solid: 'border',
      outline: 'bg-transparent border',
      subtle: 'border border-transparent',
    },
    size: {
      sm: 'text-[10px] px-2.5 py-1 gap-1.5',
      md: 'text-xs px-3.5 py-1.5 gap-2',
      lg: 'text-sm px-5 py-2 gap-2.5',
    },
  },
  defaultVariants: { variant: 'subtle', size: 'md' },
});

/** Default variant colors when no colorScheme is specified. */
const VARIANT_DEFAULT_COLOR: Record<TagVariant, string> = {
  solid: 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100',
  outline: 'text-slate-900 border-gray-300 dark:text-zinc-50 dark:border-zinc-600',
  subtle: 'bg-gray-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
};

const INTERACTIVE_HOVER: Record<TagVariant, string> = {
  solid: 'hover:opacity-80 active:opacity-70',
  outline: 'hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  subtle: 'hover:bg-gray-200/80 active:bg-gray-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
};

const DOT_SIZE: Record<TagSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

const CLOSE_SIZE: Record<TagSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

/**
 * Tag element for labels, statuses, and categories.
 *
 * Supports interactive (clickable) mode, status dot indicators,
 * leading icon slot, animated dismiss on close, and HTML5 drag-and-drop.
 *
 * **Draggable**: enables grab cursor and HTML5 drag. Sets `kb-tag` MIME data
 * with the tag's `value` (or text content). Use inside `kb-tag-group[reorderable]`
 * for automatic reordering, or handle `dragstart`/`dragend` events manually.
 *
 * @slot - Tag label content.
 * @slot icon - Leading icon element rendered before the label.
 *
 * @fires kb-click - Interactive tag clicked/activated.
 * @fires kb-close - Close button clicked; tag animates out and removes itself.
 *
 * @example
 * ```html
 * <kb-tag variant="outline" dot color-scheme="green">Healthy</kb-tag>
 * <kb-tag interactive closable color-scheme="blue">Filter</kb-tag>
 * <kb-tag draggable value="tag-1">Drag me</kb-tag>
 * ```
 */
@customElement('kb-tag')
export class KbTag extends KbBaseElement {
  /** Visual variant controlling fill, border, and text styles. @defaultValue 'subtle' */
  @property({ type: String }) variant: TagVariant = 'subtle';
  /** Tag size affecting font size and padding. @defaultValue 'md' */
  @property({ type: String }) size: TagSize = 'md';
  /** Color scheme for the tag. Overrides default variant colors. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Show a close button that dismisses the tag with animation. @defaultValue false */
  @property({ type: Boolean }) closable: boolean = false;
  /** Make the tag focusable and clickable, emitting `kb-click`. @defaultValue false */
  @property({ type: Boolean }) interactive: boolean = false;
  /** Show a small colored dot indicator before the label. @defaultValue false */
  @property({ type: Boolean }) dot: boolean = false;
  /** Enable HTML5 drag-and-drop on this tag. @defaultValue false */
  @property({ type: Boolean, attribute: 'kb-draggable' }) kbDraggable: boolean = false;
  /** Value identifier used for drag data and reorder events. @defaultValue '' */
  @property({ type: String }) value: string = '';

  @state() private _dismissing = false;
  @state() private _dragging = false;

  private _handleClick(): void {
    if (!this.interactive) return;
    this.dispatchEvent(new CustomEvent('kb-click', { bubbles: true, composed: true }));
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (!this.interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  private _handleDragStart(e: DragEvent): void {
    if (!this.kbDraggable) return;
    this._dragging = true;
    const data = this.value || this.textContent?.trim() || '';
    e.dataTransfer?.setData('application/kb-tag', data);
    e.dataTransfer?.setData('text/plain', data);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  }

  private _handleDragEnd(): void {
    this._dragging = false;
  }

  private _handleClose(e: MouseEvent): void {
    e.stopPropagation();
    this._dismissing = true;
    this.dispatchEvent(new CustomEvent('kb-close', { bubbles: true, composed: true }));
    dismissWithAnimation(this, '[data-kb-tag-inner]', 200);
  }

  override render() {
    const recipeClasses = tagRecipe({ variant: this.variant, size: this.size });
    const colorClasses = this.colorScheme
      ? this.variant === 'solid'
        ? lookupScheme(STATIC_SOLID, this.colorScheme) ?? VARIANT_DEFAULT_COLOR[this.variant]
        : this.variant === 'outline'
          ? lookupScheme(STATIC_OUTLINE, this.colorScheme) ?? VARIANT_DEFAULT_COLOR[this.variant]
          : lookupScheme(STATIC_SUBTLE, this.colorScheme) ?? VARIANT_DEFAULT_COLOR[this.variant]
      : VARIANT_DEFAULT_COLOR[this.variant];

    const cursorClass = this.kbDraggable
      ? this._dragging ? 'cursor-grabbing' : 'cursor-grab'
      : this.interactive ? 'cursor-pointer' : '';

    const interactiveClasses = this.interactive
      ? [
          kbClasses.focus,
          kbClasses.transition,
          INTERACTIVE_HOVER[this.variant] ?? '',
        ].join(' ')
      : kbClasses.transition;

    const dismissClasses = this._dismissing
      ? 'opacity-0 scale-95'
      : 'opacity-100 scale-100';

    const dragClasses = this._dragging ? 'opacity-40' : '';

    const classes = this.buildClasses(
      recipeClasses,
      colorClasses,
      interactiveClasses,
      cursorClass,
      'transition-all duration-150 ease-in-out',
      dismissClasses,
      dragClasses,
    );

    const iconContent = this.slotted('icon');
    const dotEl = this.dot
      ? html`<span class="rounded-full shrink-0 ${DOT_SIZE[this.size]} ${lookupScheme(BG_COLOR, this.colorScheme) ?? 'bg-current'}"></span>`
      : nothing;

    const closeEl = this.closable
      ? html`<button
          class="shrink-0 cursor-pointer opacity-50 hover:opacity-100 ${kbClasses.transition} leading-none p-0 bg-transparent border-none text-current"
          @click=${(e: MouseEvent) => this._handleClose(e)}
          aria-label="Remove tag"
        ><svg class="${CLOSE_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`
      : nothing;

    return html`
      <span
        class=${classes}
        data-kb-tag-inner
        draggable=${this.kbDraggable ? 'true' : nothing}
        tabindex=${this.interactive ? '0' : nothing}
        role=${this.interactive ? 'button' : nothing}
        @click=${this._handleClick}
        @keydown=${(e: KeyboardEvent) => this._handleKeydown(e)}
        @dragstart=${(e: DragEvent) => this._handleDragStart(e)}
        @dragend=${() => this._handleDragEnd()}
      >
        ${dotEl}
        ${iconContent}
        ${this.defaultSlotContent}
        ${closeEl}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-tag': KbTag;
  }
}
