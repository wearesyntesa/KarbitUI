import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const cardRecipe = recipe({
  base: `font-sans ${kbClasses.transitionColors}`,
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

export type CardVariant = InferVariant<typeof cardRecipe, 'variant'>;

const INTERACTIVE_CLASSES: string = cx(
  'cursor-pointer select-none',
  'hover:border-gray-300 dark:hover:border-zinc-500',
  'hover:bg-gray-50/50 dark:hover:bg-zinc-800/30',
  'active:bg-gray-100 dark:active:bg-zinc-700/50',
  kbClasses.focus,
);

const GHOST_INTERACTIVE_CLASSES: string = cx(
  'cursor-pointer select-none',
  'hover:bg-gray-50 dark:hover:bg-zinc-800/50',
  'active:bg-gray-100 dark:active:bg-zinc-700/50',
  kbClasses.focus,
);

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
export class KbCard extends KbBaseElement<'header' | 'footer'> {
  static override hostDisplay = 'block' as const;

  /** Visual variant controlling border, background, and elevation. @defaultValue 'outline' */
  @property({ type: String }) variant: CardVariant = 'outline';
  /** Inner padding size. @defaultValue 'md' */
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
  /** When true, the card is focusable and emits `kb-click` on activation. @defaultValue false */
  @property({ type: Boolean }) interactive: boolean = false;
  /** Accessible label for an interactive card (used as `aria-label` on the `role="button"` element). @defaultValue '' */
  @property({ type: String }) label: string = '';
  /** URL to navigate to - renders the card as an anchor element. @defaultValue '' */
  @property({ type: String }) href: string = '';
  /** Link target attribute, e.g. `'_blank'`. Only used when `href` is set. @defaultValue '' */
  @property({ type: String }) target: string = '';

  private _handleClick(): void {
    if (!this.interactive) return;
    this.emit('kb-click');
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (!this.interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  }

  private _renderContent(): TemplateResult {
    const headerEl = this.slotted('header');
    const footerEl = this.slotted('footer');

    return html`
      ${
        headerEl
          ? html`<div class="${kbClasses.label} select-none mb-3 pb-3 ${kbClasses.borderBottom}">${headerEl}</div>`
          : nothing
      }
      <div class=${kbClasses.textPrimary}>${this.defaultSlotContent}</div>
      ${
        footerEl
          ? html`<div class="mt-3 pt-3 border-t ${kbClasses.borderColor} text-sm ${kbClasses.textSecondary}">${footerEl}</div>`
          : nothing
      }
    `;
  }

  private _buildBaseClasses(): string {
    const isGhost = this.variant === 'ghost';
    let interactiveClasses = '';
    if (this.interactive) {
      interactiveClasses = isGhost ? GHOST_INTERACTIVE_CLASSES : INTERACTIVE_CLASSES;
    }
    const passiveHover = this.interactive || isGhost || this.href ? '' : PASSIVE_HOVER_CLASSES;
    return this.buildClasses(
      cardRecipe({ variant: this.variant, size: this.size }),
      interactiveClasses,
      passiveHover,
      this.href ? 'block no-underline text-inherit' : '',
    );
  }

  override render(): TemplateResult {
    const baseClasses = this._buildBaseClasses();

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

    const ariaLabel = this.interactive && this.label ? this.label : nothing;

    return html`
      <div
        class=${baseClasses}
        role=${this.interactive ? 'button' : nothing}
        tabindex=${this.interactive ? '0' : nothing}
        aria-label=${ariaLabel}
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
