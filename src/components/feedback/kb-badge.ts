import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { dismissWithAnimation, KbBaseElement } from '../../core/base-element.js';
import { BG_COLOR, BG_COLOR_PING, lookupScheme } from '../../core/color-schemes.js';
import { renderCloseIcon } from '../../core/icons.js';
import {
  CLOSE_BUTTON_CLASSES,
  DISMISS_HIDDEN,
  DISMISS_VISIBLE,
  LABEL_INTERACTIVE_HOVER,
  LABEL_RECIPE_BASE,
  LABEL_VARIANT_STRUCTURE,
  resolveStaticColor,
} from '../../core/label-tokens.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const badgeRecipe = recipe({
  base: LABEL_RECIPE_BASE,
  variants: {
    variant: LABEL_VARIANT_STRUCTURE,
    size: {
      xs: 'text-[10px] px-1 py-0 gap-1',
      sm: 'text-xs px-1.5 py-0.5 gap-1.5',
      md: 'text-xs px-2 py-0.5 gap-1.5',
    },
  },
  defaultVariants: { variant: 'subtle', size: 'sm' },
});

export type BadgeVariant = InferVariant<typeof badgeRecipe, 'variant'>;
export type BadgeSize = InferVariant<typeof badgeRecipe, 'size'>;

const VARIANT_DEFAULT_COLOR: Record<BadgeVariant, string> = {
  solid: 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100',
  outline: 'text-slate-900 border-gray-200 dark:text-zinc-50 dark:border-zinc-700',
  subtle: 'bg-gray-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
} as const satisfies Record<BadgeVariant, string>;

const DOT_SIZE: Record<BadgeSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
} as const satisfies Record<BadgeSize, string>;

const CLOSE_SIZE: Record<BadgeSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3 h-3',
} as const satisfies Record<BadgeSize, string>;

const PING_SIZE: Record<BadgeSize, string> = {
  xs: 'w-1.5 h-1.5 -top-0.5 -right-0.5',
  sm: 'w-2 h-2 -top-0.5 -right-0.5',
  md: 'w-2.5 h-2.5 -top-1 -right-1',
} as const satisfies Record<BadgeSize, string>;

const PING_DOT_SIZE: Record<BadgeSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
} as const satisfies Record<BadgeSize, string>;

/**
 * Compact label for status indicators, counts, or category tags.
 *
 * Supports interactive (clickable) mode, status dot with optional pulse,
 * leading icon slot, animated dismiss on close, and notification ping.
 *
 * @slot - Badge text content.
 * @slot icon - Leading icon element rendered before the label.
 *
 * @fires kb-click - Interactive badge clicked/activated.
 * @fires kb-close - Close button clicked; badge animates out and removes itself.
 *
 * @example
 * ```html
 * <kb-badge variant="solid" color-scheme="green" dot pulse>LIVE</kb-badge>
 * <kb-badge interactive color-scheme="blue">Clickable</kb-badge>
 * <kb-badge closable color-scheme="red">Removable</kb-badge>
 * <kb-badge ping color-scheme="red">3</kb-badge>
 * ```
 */
@customElement('kb-badge')
export class KbBadge extends KbBaseElement<'icon'> {
  /** Visual variant controlling border, background, and text styles. @defaultValue 'subtle' */
  @property({ type: String }) variant: BadgeVariant = 'subtle';
  /** Badge size controlling padding, font size, and dot/close sizing. @defaultValue 'sm' */
  @property({ type: String }) size: BadgeSize = 'sm';
  /** Color scheme override. When unset, the variant's default color is used. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Show a status dot before the badge label. @defaultValue false */
  @property({ type: Boolean }) dot: boolean = false;
  /** Animate the status dot with a ping effect. Requires `dot` to be true. @defaultValue false */
  @property({ type: Boolean }) pulse: boolean = false;
  /** Show a notification ping indicator on the badge corner. @defaultValue false */
  @property({ type: Boolean }) ping: boolean = false;
  /** Make the badge clickable with hover/focus styles and `kb-click` events. @defaultValue false */
  @property({ type: Boolean }) interactive: boolean = false;
  /** Show a close button that dismisses the badge with animation. @defaultValue false */
  @property({ type: Boolean }) closable: boolean = false;

  @state() private _dismissing = false;

  private _handleClick(): void {
    if (!this.interactive) return;
    this.emit('kb-click');
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (!this.interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  private _handleClose(e: MouseEvent): void {
    e.stopPropagation();
    this._dismissing = true;
    this.emit('kb-close');
    dismissWithAnimation(this, '[data-kb-badge-inner]', 200);
  }

  override render(): TemplateResult {
    const recipeClasses = badgeRecipe({ variant: this.variant, size: this.size });
    const colorClasses = resolveStaticColor(this.variant, this.colorScheme, VARIANT_DEFAULT_COLOR);

    const interactiveClasses = this.interactive
      ? cx(kbClasses.focus, kbClasses.transition, LABEL_INTERACTIVE_HOVER[this.variant] ?? '', 'cursor-pointer')
      : kbClasses.transition;

    const dismissClasses = this._dismissing ? DISMISS_HIDDEN : DISMISS_VISIBLE;

    const classes = this.buildClasses(
      recipeClasses,
      colorClasses,
      interactiveClasses,
      kbClasses.transition,
      dismissClasses,
    );

    const iconContent = this.slotted('icon');

    const dotColor = lookupScheme(BG_COLOR, this.colorScheme) ?? 'bg-current';
    let dotEl = nothing as typeof nothing | ReturnType<typeof html>;
    if (this.dot) {
      dotEl = this.pulse
        ? html`<span class="relative inline-flex shrink-0 ${DOT_SIZE[this.size]}">
            <span class="absolute inset-0 rounded-full ${dotColor} animate-ping opacity-75"></span>
            <span class="relative rounded-full ${dotColor} ${DOT_SIZE[this.size]}"></span>
          </span>`
        : html`<span class="rounded-full shrink-0 ${DOT_SIZE[this.size]} ${dotColor}"></span>`;
    }

    const closeEl = this.closable
      ? html`<button
          class="${CLOSE_BUTTON_CLASSES}"
          @click=${this._handleClose}
          aria-label="Remove badge"
        >${renderCloseIcon(CLOSE_SIZE[this.size], 2.5)}</button>`
      : nothing;

    const pingColor = lookupScheme(BG_COLOR_PING, this.colorScheme) ?? 'bg-current/75';
    const pingDotColor = lookupScheme(BG_COLOR, this.colorScheme) ?? 'bg-current';
    const pingEl = this.ping
      ? html`<span class="absolute ${PING_SIZE[this.size]} flex">
          <span class="animate-ping absolute inset-0 rounded-full ${pingColor}"></span>
          <span class="relative rounded-full ${PING_DOT_SIZE[this.size]} ${pingDotColor}"></span>
        </span>`
      : nothing;

    return html`
      <span
        class=${this.ping ? 'relative inline-flex' : 'contents'}
        data-kb-badge-outer
      >
        <span
          class=${classes}
          data-kb-badge-inner
          tabindex=${this.interactive ? '0' : nothing}
          role=${this.interactive ? 'button' : nothing}
          @click=${this._handleClick}
          @keydown=${this._handleKeydown}
        >
          ${dotEl}
          ${iconContent}
          ${this.defaultSlotContent}
          ${closeEl}
        </span>
        ${pingEl}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-badge': KbBadge;
  }
}
