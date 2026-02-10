import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme } from '../../core/types.js';

type BadgeVariant = 'solid' | 'outline' | 'subtle';
type BadgeSize = 'xs' | 'sm' | 'md';

const badgeRecipe = recipe({
  base: 'inline-flex items-center font-mono font-semibold uppercase tracking-widest whitespace-nowrap select-none',
  variants: {
    variant: {
      solid: 'border',
      outline: 'bg-transparent border',
      subtle: 'border border-transparent',
    },
    size: {
      xs: 'text-[10px] px-1 py-0 gap-1',
      sm: 'text-xs px-1.5 py-0.5 gap-1.5',
      md: 'text-xs px-2 py-0.5 gap-1.5',
    },
  },
  defaultVariants: { variant: 'subtle', size: 'sm' },
});

const VARIANT_DEFAULT_COLOR: Record<BadgeVariant, string> = {
  solid: 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100',
  outline: 'text-slate-900 border-gray-200 dark:text-zinc-50 dark:border-zinc-700',
  subtle: 'bg-gray-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
};

const BADGE_COLOR_SOLID: Record<string, string> = {
  black: 'bg-gray-900 border-gray-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900',
  red: 'bg-red-500 border-red-500 text-white dark:bg-red-600 dark:border-red-600',
  blue: 'bg-blue-500 border-blue-500 text-white dark:bg-blue-600 dark:border-blue-600',
  green: 'bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600',
  yellow: 'bg-yellow-500 border-yellow-500 text-black dark:bg-yellow-500 dark:border-yellow-500 dark:text-black',
};

const BADGE_COLOR_OUTLINE: Record<string, string> = {
  black: 'border-gray-900 text-gray-900 dark:border-zinc-100 dark:text-zinc-100',
  red: 'border-red-500 text-red-700 dark:border-red-400 dark:text-red-400',
  blue: 'border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-400',
  green: 'border-green-500 text-green-700 dark:border-green-400 dark:text-green-400',
  yellow: 'border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-400',
};

const BADGE_COLOR_SUBTLE: Record<string, string> = {
  black: 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const INTERACTIVE_HOVER: Record<BadgeVariant, string> = {
  solid: 'hover:opacity-80 active:opacity-70',
  outline: 'hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700',
  subtle: 'hover:bg-gray-200/80 active:bg-gray-200 dark:hover:bg-zinc-700 dark:active:bg-zinc-600',
};

const DOT_COLOR: Record<string, string> = {
  black: 'bg-gray-900 dark:bg-zinc-100',
  red: 'bg-red-500 dark:bg-red-400',
  blue: 'bg-blue-500 dark:bg-blue-400',
  green: 'bg-green-500 dark:bg-green-400',
  yellow: 'bg-yellow-500 dark:bg-yellow-400',
};

const PING_COLOR: Record<string, string> = {
  black: 'bg-gray-900/75 dark:bg-zinc-100/75',
  red: 'bg-red-500/75 dark:bg-red-400/75',
  blue: 'bg-blue-500/75 dark:bg-blue-400/75',
  green: 'bg-green-500/75 dark:bg-green-400/75',
  yellow: 'bg-yellow-500/75 dark:bg-yellow-400/75',
};

const DOT_SIZE: Record<BadgeSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
};

const CLOSE_SIZE: Record<BadgeSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3 h-3',
};

const PING_SIZE: Record<BadgeSize, string> = {
  xs: 'w-1.5 h-1.5 -top-0.5 -right-0.5',
  sm: 'w-2 h-2 -top-0.5 -right-0.5',
  md: 'w-2.5 h-2.5 -top-1 -right-1',
};

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
export class KbBadge extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) variant: BadgeVariant = 'subtle';
  @property({ type: String }) size: BadgeSize = 'sm';
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  @property({ type: Boolean }) dot: boolean = false;
  @property({ type: Boolean }) pulse: boolean = false;
  @property({ type: Boolean }) ping: boolean = false;
  @property({ type: Boolean }) interactive: boolean = false;
  @property({ type: Boolean }) closable: boolean = false;

  @state() private _dismissing = false;

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

  private _handleClose(e: MouseEvent): void {
    e.stopPropagation();
    this._dismissing = true;
    this.dispatchEvent(new CustomEvent('kb-close', { bubbles: true, composed: true }));

    const el = this.renderRoot.querySelector('[data-kb-badge-inner]') as HTMLElement | null;
    if (el) {
      el.addEventListener('transitionend', () => this.remove(), { once: true });
      setTimeout(() => this.remove(), 200);
    } else {
      this.remove();
    }
  }

  override render() {
    const recipeClasses = badgeRecipe({ variant: this.variant, size: this.size });
    const colorClasses = this.colorScheme
      ? this.variant === 'solid'
        ? BADGE_COLOR_SOLID[this.colorScheme] ?? VARIANT_DEFAULT_COLOR[this.variant]
        : this.variant === 'outline'
          ? BADGE_COLOR_OUTLINE[this.colorScheme] ?? VARIANT_DEFAULT_COLOR[this.variant]
          : BADGE_COLOR_SUBTLE[this.colorScheme] ?? VARIANT_DEFAULT_COLOR[this.variant]
      : VARIANT_DEFAULT_COLOR[this.variant];

    const interactiveClasses = this.interactive
      ? [kbClasses.focus, kbClasses.transition, INTERACTIVE_HOVER[this.variant] ?? '', 'cursor-pointer'].join(' ')
      : kbClasses.transition;

    const dismissClasses = this._dismissing
      ? 'opacity-0 scale-95'
      : 'opacity-100 scale-100';

    const classes = this.buildClasses(
      recipeClasses,
      colorClasses,
      interactiveClasses,
      'transition-all duration-150 ease-in-out',
      dismissClasses,
    );

    const iconContent = this.slotted('icon');

    const dotColor = this.colorScheme ? DOT_COLOR[this.colorScheme] ?? 'bg-current' : 'bg-current';
    const dotEl = this.dot
      ? this.pulse
        ? html`<span class="relative inline-flex shrink-0 ${DOT_SIZE[this.size]}">
            <span class="absolute inset-0 rounded-full ${dotColor} animate-ping opacity-75"></span>
            <span class="relative rounded-full ${dotColor} ${DOT_SIZE[this.size]}"></span>
          </span>`
        : html`<span class="rounded-full shrink-0 ${DOT_SIZE[this.size]} ${dotColor}"></span>`
      : nothing;

    const closeEl = this.closable
      ? html`<button
          class="shrink-0 cursor-pointer opacity-50 hover:opacity-100 ${kbClasses.transition} leading-none p-0 bg-transparent border-none text-current"
          @click=${(e: MouseEvent) => this._handleClose(e)}
          aria-label="Remove badge"
        ><svg class="${CLOSE_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>`
      : nothing;

    const pingColor = this.colorScheme ? PING_COLOR[this.colorScheme] ?? 'bg-current/75' : 'bg-current/75';
    const pingDotColor = this.colorScheme ? DOT_COLOR[this.colorScheme] ?? 'bg-current' : 'bg-current';
    const pingEl = this.ping
      ? html`<span class="absolute ${PING_SIZE[this.size]} flex">
          <span class="animate-ping absolute inset-0 rounded-full ${pingColor}"></span>
          <span class="relative rounded-full ${PING_SIZE[this.size].split(' ').slice(0, 2).join(' ')} ${pingDotColor}"></span>
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
          @keydown=${(e: KeyboardEvent) => this._handleKeydown(e)}
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
