import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';

export type CardVariant = 'outline' | 'elevated' | 'filled' | 'ghost';

const cardRecipe = recipe({
  base: `font-sans ${kbClasses.transition}`,
  variants: {
    variant: {
      outline: `${kbClasses.border} ${kbClasses.surface}`,
      elevated: `${kbClasses.border} ${kbClasses.surface}`,
      filled: `${kbClasses.border} ${kbClasses.surfaceMuted}`,
      ghost: '',
    },
    size: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: { variant: 'outline', size: 'md' },
});

const INTERACTIVE_CLASSES = [
  'cursor-pointer select-none',
  'hover:border-gray-300 dark:hover:border-zinc-500',
  'hover:bg-gray-50/50 dark:hover:bg-zinc-800/30',
  'active:bg-gray-100 dark:active:bg-zinc-700/50',
  kbClasses.focus,
].join(' ');

const GHOST_INTERACTIVE_CLASSES = [
  'cursor-pointer select-none',
  'hover:bg-gray-50 dark:hover:bg-zinc-800/50',
  'active:bg-gray-100 dark:active:bg-zinc-700/50',
  kbClasses.focus,
].join(' ');

const PASSIVE_HOVER_CLASSES = 'hover:border-gray-300 dark:hover:border-zinc-600';

/**
 * Content card container with structured minimal styling.
 *
 * Supports interactive (button-like) and linked (anchor) modes.
 * When `interactive` is set, the card is focusable and emits `kb-click` on activation.
 * When `href` is set, the card renders as a navigable link.
 *
 * @slot - Card body content.
 * @slot header - Card header content.
 * @slot footer - Card footer content.
 *
 * @fires kb-click - Dispatched when an interactive card is clicked or activated via keyboard.
 *
 * @example
 * ```html
 * <kb-card variant="outline">
 *   <div slot="header">System Status</div>
 *   <p>All systems operational.</p>
 *   <div slot="footer">Last checked: now</div>
 * </kb-card>
 * ```
 */
@customElement('kb-card')
export class KbCard extends KbBaseElement {
  static override hostDisplay = 'block';

  /** Visual variant controlling border, background, and elevation. @defaultValue 'outline' */
  @property({ type: String }) variant: CardVariant = 'outline';
  /** Inner padding size. @defaultValue 'md' */
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
  /** When true, the card is focusable and emits `kb-click` on activation. @defaultValue false */
  @property({ type: Boolean }) interactive: boolean = false;
  /** URL to navigate to — renders the card as an anchor element. @defaultValue '' */
  @property({ type: String }) href: string = '';
  /** Link target attribute, e.g. `'_blank'`. Only used when `href` is set. @defaultValue '' */
  @property({ type: String }) target: string = '';

  private _handleClick(): void {
    if (!this.interactive) return;
    this.dispatchEvent(new CustomEvent('kb-click', {
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (!this.interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  private _renderContent() {
    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');

    return html`
      ${headerEl
        ? html`<div class="${kbClasses.label} mb-3 pb-3 ${kbClasses.borderBottom}">${headerEl}</div>`
        : nothing}
      <div class=${kbClasses.textPrimary}>${this.defaultSlotContent}</div>
      ${footerEl
        ? html`<div class="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700 text-sm ${kbClasses.textSecondary}">${footerEl}</div>`
        : nothing}
    `;
  }

  override render() {
    const isGhost = this.variant === 'ghost';
    const interactiveClasses = this.interactive
      ? (isGhost ? GHOST_INTERACTIVE_CLASSES : INTERACTIVE_CLASSES)
      : '';

    const passiveHover = !this.interactive && !isGhost && !this.href
      ? PASSIVE_HOVER_CLASSES
      : '';

    const baseClasses = this.buildClasses(
      cardRecipe({ variant: this.variant, size: this.size }),
      interactiveClasses,
      passiveHover,
      this.href ? 'block no-underline text-inherit' : '',
    );

    if (this.href) {
      return html`
        <a
          class=${baseClasses}
          href=${this.href}
          target=${this.target || nothing}
          rel=${this.target === '_blank' ? 'noopener noreferrer' : nothing}
        >
          ${this._renderContent()}
        </a>
      `;
    }

    return html`
      <div
        class=${baseClasses}
        role=${this.interactive ? 'button' : nothing}
        tabindex=${this.interactive ? '0' : nothing}
        @click=${this.interactive ? this._handleClick : nothing}
        @keydown=${this.interactive ? this._handleKeyDown : nothing}
      >
        ${this._renderContent()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-card': KbCard;
  }
}
