import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { BG_COLOR, lookupScheme } from '../../core/color-schemes.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const WHITESPACE_RE: RegExp = /\s+/;

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const avatarRecipe = recipe({
  base: cx(
    'inline-flex items-center justify-center overflow-hidden select-none shrink-0',
    'font-sans font-semibold uppercase',
    kbClasses.border,
    kbClasses.transitionColors,
  ),
  variants: {
    size: {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-14 h-14 text-base',
      xl: 'w-20 h-20 text-lg',
    },
  },
  defaultVariants: { size: 'md' },
});

export type AvatarSize = InferVariant<typeof avatarRecipe, 'size'>;

const DEFAULT_BG = 'bg-gray-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300';

const ICON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-10 h-10',
} as const satisfies Record<ComponentSize, string>;

const BADGE_SIZE: Record<ComponentSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
} as const satisfies Record<ComponentSize, string>;

const BADGE_POS: Record<ComponentSize, string> = {
  xs: '-top-px -right-px',
  sm: '-top-0.5 -right-0.5',
  md: '-top-0.5 -right-0.5',
  lg: '-top-0.5 -right-0.5',
  xl: '-top-1 -right-1',
} as const satisfies Record<ComponentSize, string>;

function extractInitials(name: string): string {
  const parts = name.trim().split(WHITESPACE_RE);
  if (parts.length === 0) return '';
  if (parts.length === 1) return (parts[0] as string).charAt(0).toUpperCase();
  return ((parts[0] as string).charAt(0) + (parts[parts.length - 1] as string).charAt(0)).toUpperCase();
}

/**
 * User or entity avatar displaying an image, initials, or a fallback icon.
 *
 * Falls back from image → initials → generic icon automatically.
 * Supports a status badge indicator and color scheme override.
 *
 * @slot icon - Custom fallback icon rendered when no image or name is available.
 *
 * @example
 * ```html
 * <kb-avatar src="/photo.jpg" name="Jane Doe" size="lg"></kb-avatar>
 * <kb-avatar name="John Smith" color-scheme="blue"></kb-avatar>
 * <kb-avatar size="sm" badge="green"></kb-avatar>
 * ```
 */
export class KbAvatar extends KbBaseElement<'icon'> {
  /** Image URL. Falls back to initials or icon when unset or broken. */
  @property({ type: String }) src?: string;
  /** Full name used to derive initials when no image is available. */
  @property({ type: String }) name?: string;
  /** Avatar dimensions. @defaultValue 'md' */
  @property({ type: String }) size: AvatarSize = 'md';
  /** Background color scheme. When unset, a neutral gray is used. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Show a small status badge in the top-right corner with the given color scheme. */
  @property({ type: String }) badge?: ColorScheme;

  @state() private _imgFailed = false;

  private _cachedRecipeClasses = '';

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this._cachedRecipeClasses === '' || changed.has('size')) {
      this._cachedRecipeClasses = avatarRecipe({ size: this.size });
    }
    if (changed.has('src')) {
      this._imgFailed = false;
    }
  }

  private _handleImgError(): void {
    this._imgFailed = true;
  }

  private _renderFallbackIcon(): TemplateResult {
    const s = ICON_SIZE[this.size] ?? ICON_SIZE.md;
    return html`<svg class="${s} opacity-60" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>`;
  }

  override render(): TemplateResult {
    const bgClasses = this.colorScheme
      ? cx(lookupScheme(BG_COLOR, this.colorScheme) ?? DEFAULT_BG, 'text-white')
      : DEFAULT_BG;

    const classes = this.buildClasses(this._cachedRecipeClasses, bgClasses, 'relative');

    const showImg = this.src && !this._imgFailed;
    const initials = this.name ? extractInitials(this.name) : '';
    const customIcon = this.slotted('icon');

    let content: TemplateResult | string;
    if (showImg) {
      content = html`<img
        class="w-full h-full object-cover"
        src=${this.src as string}
        alt=${this.name ?? ''}
        @error=${this._handleImgError}
      />`;
    } else if (initials) {
      content = html`<span class="leading-none">${initials}</span>`;
    } else if (customIcon) {
      content = html`${customIcon}`;
    } else {
      content = this._renderFallbackIcon();
    }

    const badgeEl = this.badge
      ? html`<span class="absolute ${BADGE_POS[this.size]} ${BADGE_SIZE[this.size]} ${lookupScheme(BG_COLOR, this.badge) ?? 'bg-green-500 dark:bg-green-400'} ${kbClasses.border}" style="border-radius:9999px"></span>`
      : nothing;

    return html`<span
      class=${classes}
      role="img"
      aria-label=${this.name ?? 'Avatar'}
    >${content}${badgeEl}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-avatar': KbAvatar;
  }
}
