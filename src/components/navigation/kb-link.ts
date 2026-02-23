import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { lookupScheme } from '../../core/color-schemes.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, KnownColorScheme } from '../../core/types.js';

export type LinkVariant = 'underline' | 'hover-underline' | 'plain' | 'subtle' | 'highlight';

const COLOR_TEXT: Record<KnownColorScheme, string> = {
  black: 'text-gray-900 hover:text-black dark:text-zinc-100 dark:hover:text-white',
  red: 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300',
  blue: 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300',
  green: 'text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300',
  yellow: 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_DEFAULT = 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300';

const COLOR_DECORATION: Record<KnownColorScheme, string> = {
  black: 'decoration-gray-400 hover:decoration-gray-900 dark:decoration-zinc-500 dark:hover:decoration-zinc-100',
  red: 'decoration-red-300 hover:decoration-red-500 dark:decoration-red-700 dark:hover:decoration-red-400',
  blue: 'decoration-blue-300 hover:decoration-blue-500 dark:decoration-blue-700 dark:hover:decoration-blue-400',
  green: 'decoration-green-300 hover:decoration-green-500 dark:decoration-green-700 dark:hover:decoration-green-400',
  yellow:
    'decoration-yellow-300 hover:decoration-yellow-600 dark:decoration-yellow-700 dark:hover:decoration-yellow-400',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_DECORATION_DEFAULT =
  'decoration-blue-300 hover:decoration-blue-500 dark:decoration-blue-700 dark:hover:decoration-blue-400';

const COLOR_SUBTLE: Record<KnownColorScheme, string> = {
  black: 'border-gray-300 hover:border-gray-900 dark:border-zinc-600 dark:hover:border-zinc-100',
  red: 'border-red-200 hover:border-red-500 dark:border-red-800 dark:hover:border-red-400',
  blue: 'border-blue-200 hover:border-blue-500 dark:border-blue-800 dark:hover:border-blue-400',
  green: 'border-green-200 hover:border-green-500 dark:border-green-800 dark:hover:border-green-400',
  yellow: 'border-yellow-200 hover:border-yellow-600 dark:border-yellow-800 dark:hover:border-yellow-400',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_SUBTLE_DEFAULT = 'border-gray-200 hover:border-blue-500 dark:border-zinc-700 dark:hover:border-blue-400';

const COLOR_HIGHLIGHT: Record<KnownColorScheme, string> = {
  black: 'hover:bg-gray-100 dark:hover:bg-zinc-800',
  red: 'hover:bg-red-50 dark:hover:bg-red-950',
  blue: 'hover:bg-blue-50 dark:hover:bg-blue-950',
  green: 'hover:bg-green-50 dark:hover:bg-green-950',
  yellow: 'hover:bg-yellow-50 dark:hover:bg-yellow-950',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_HIGHLIGHT_DEFAULT = 'hover:bg-blue-50 dark:hover:bg-blue-950';

const COLOR_HOVER_UNDERLINE: Record<KnownColorScheme, string> = {
  black: 'bg-gray-900 dark:bg-zinc-100',
  red: 'bg-red-500 dark:bg-red-400',
  blue: 'bg-blue-500 dark:bg-blue-400',
  green: 'bg-green-500 dark:bg-green-400',
  yellow: 'bg-yellow-600 dark:bg-yellow-400',
} as const satisfies Record<KnownColorScheme, string>;

const COLOR_HOVER_UNDERLINE_DEFAULT = 'bg-blue-500 dark:bg-blue-400';

const COLOR_VISITED: Record<KnownColorScheme, string> = {
  black: 'visited:text-gray-500 dark:visited:text-zinc-500',
  red: 'visited:text-red-400 dark:visited:text-red-600',
  blue: 'visited:text-purple-600 dark:visited:text-purple-400',
  green: 'visited:text-green-400 dark:visited:text-green-600',
  yellow: 'visited:text-yellow-500 dark:visited:text-yellow-600',
} as const satisfies Record<KnownColorScheme, string>;

const EXTERNAL_ATTRS = { target: '_blank', rel: 'noopener noreferrer' } as const;

const COLOR_VISITED_DEFAULT = 'visited:text-purple-600 dark:visited:text-purple-400';

const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const satisfies Record<ComponentSize, string>;

const SIZE_GAP: Record<ComponentSize, string> = {
  xs: 'gap-0.5',
  sm: 'gap-1',
  md: 'gap-1',
  lg: 'gap-1.5',
  xl: 'gap-2',
} as const satisfies Record<ComponentSize, string>;

const SIZE_ICON: Record<ComponentSize, string> = {
  xs: '[&_svg]:w-3 [&_svg]:h-3',
  sm: '[&_svg]:w-3.5 [&_svg]:h-3.5',
  md: '[&_svg]:w-4 [&_svg]:h-4',
  lg: '[&_svg]:w-[1.125rem] [&_svg]:h-[1.125rem]',
  xl: '[&_svg]:w-5 [&_svg]:h-5',
} as const satisfies Record<ComponentSize, string>;

const SIZE_EXTERNAL: Record<ComponentSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-[1.125rem] h-[1.125rem]',
} as const satisfies Record<ComponentSize, string>;

const SIZE_HIGHLIGHT_PX: Record<ComponentSize, string> = {
  xs: 'px-1 py-0',
  sm: 'px-1 py-0',
  md: 'px-1.5 py-0.5',
  lg: 'px-1.5 py-0.5',
  xl: 'px-2 py-0.5',
} as const satisfies Record<ComponentSize, string>;

/**
 * Styled anchor link with multiple variants, icon slots, sizes,
 * animated hover effects, and SPA-friendly navigation event.
 *
 * @slot - Link text content.
 * @slot icon-left - Leading icon (SVG auto-sized per `size`).
 * @slot icon-right - Trailing icon (SVG auto-sized per `size`).
 *
 * @fires kb-link-click - Link clicked. Detail: `{ href: string }`.
 *
 * @example
 * ```html
 * <kb-link href="/about" variant="hover-underline" size="md">About Us</kb-link>
 * <kb-link href="https://example.com" external>External Link</kb-link>
 * ```
 */
@customElement('kb-link')
export class KbLink extends KbBaseElement<'icon-left' | 'icon-right'> {
  /** URL the link navigates to. @defaultValue '#' */
  @property({ type: String }) href: string = '#';
  /** Visual variant controlling underline and hover behavior. @defaultValue 'underline' */
  @property({ type: String }) variant: LinkVariant = 'underline';
  /** Text and icon size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Open link in a new tab with `rel="noopener noreferrer"` and show an external icon. @defaultValue false */
  @property({ type: Boolean }) external: boolean = false;
  /** Disables the link, preventing navigation and applying reduced opacity. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Truncate link text with ellipsis when it overflows. @defaultValue false */
  @property({ type: Boolean }) truncate: boolean = false;
  /** Apply visited-link color styling. @defaultValue false */
  @property({ type: Boolean, attribute: 'show-visited' }) showVisited: boolean = false;
  /** Color scheme for text, decoration, and hover effects. Overrides the default blue. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;

  private _handleClick(e: Event): void {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    this.emit('kb-link-click', { href: this.href });
  }

  private _getColorClasses(): string {
    const cs = this.colorScheme;
    return lookupScheme(COLOR_TEXT, cs) ?? COLOR_DEFAULT;
  }

  private _getVariantClasses(): { classes: string; hasHoverUnderline: boolean } {
    const cs = this.colorScheme;
    switch (this.variant) {
      case 'underline':
        return {
          classes: `underline underline-offset-4 decoration-1 hover:decoration-2 ${lookupScheme(COLOR_DECORATION, cs) ?? COLOR_DECORATION_DEFAULT}`,
          hasHoverUnderline: false,
        };
      case 'hover-underline':
        return { classes: 'relative', hasHoverUnderline: true };
      case 'plain':
        return { classes: '', hasHoverUnderline: false };
      case 'subtle':
        return {
          classes: `border-b pb-0.5 ${lookupScheme(COLOR_SUBTLE, cs) ?? COLOR_SUBTLE_DEFAULT}`,
          hasHoverUnderline: false,
        };
      case 'highlight':
        return {
          classes: `${SIZE_HIGHLIGHT_PX[this.size]} ${lookupScheme(COLOR_HIGHLIGHT, cs) ?? COLOR_HIGHLIGHT_DEFAULT}`,
          hasHoverUnderline: false,
        };
    }
  }

  private _renderIconSlot(slotName: 'icon-left' | 'icon-right'): TemplateResult | typeof nothing {
    const el = this.slotted(slotName);
    if (!el) return nothing;
    return html`<span class="inline-flex items-center shrink-0 ${SIZE_ICON[this.size]}">${el}</span>`;
  }

  private _renderExternalIcon(): TemplateResult | typeof nothing {
    if (!this.external) return nothing;
    return html`<svg class="${SIZE_EXTERNAL[this.size]} shrink-0 select-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  }

  private _renderHoverUnderline(active: boolean): TemplateResult | typeof nothing {
    if (!active) return nothing;
    const color = lookupScheme(COLOR_HOVER_UNDERLINE, this.colorScheme) ?? COLOR_HOVER_UNDERLINE_DEFAULT;
    return html`<span class="absolute bottom-0 left-0 w-full h-px ${color} scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 ease-in-out origin-left pointer-events-none"></span>`;
  }

  override render(): TemplateResult {
    const cs = this.colorScheme;
    const colorClasses = this._getColorClasses();
    const { classes: variantClasses, hasHoverUnderline } = this._getVariantClasses();

    const visitedClass = this.showVisited ? (lookupScheme(COLOR_VISITED, cs) ?? COLOR_VISITED_DEFAULT) : '';
    const disabledClass = this.disabled ? kbClasses.disabledLook : 'cursor-pointer';
    const truncateClass = this.truncate ? 'truncate max-w-48' : '';

    const classes = this.buildClasses(
      'font-sans inline-flex items-center',
      SIZE_TEXT[this.size],
      SIZE_GAP[this.size],
      kbClasses.transitionColors,
      'active:opacity-70',
      kbClasses.focus,
      colorClasses,
      variantClasses,
      visitedClass,
      disabledClass,
      truncateClass,
    );

    return html`
      <a
        class="${classes} group/link"
        href=${this.disabled ? nothing : this.href}
        target=${this.external ? EXTERNAL_ATTRS.target : nothing}
        rel=${this.external ? EXTERNAL_ATTRS.rel : nothing}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        tabindex=${this.disabled ? '-1' : nothing}
        @click=${this._handleClick}
      >
        ${this._renderIconSlot('icon-left')}
        <span class="${this.truncate ? 'truncate' : ''}">${this.defaultSlotContent}</span>
        ${this._renderIconSlot('icon-right')}
        ${this._renderExternalIcon()}
        ${this._renderHoverUnderline(hasHoverUnderline)}
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-link': KbLink;
  }
}
