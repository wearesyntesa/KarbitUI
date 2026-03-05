import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { ComponentSize } from '../../core/types.js';

export type AvatarGroupSpacing = 'sm' | 'md' | 'lg';

const OVERLAP_MAP: Record<AvatarGroupSpacing, string> = {
  sm: '-space-x-2',
  md: '-space-x-3',
  lg: '-space-x-4',
} as const satisfies Record<AvatarGroupSpacing, string>;

const EXCESS_SIZE: Record<ComponentSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-lg',
} as const satisfies Record<ComponentSize, string>;

/**
 * Overlapping container for `kb-avatar` elements with an optional "+N" excess indicator.
 *
 * @example
 * ```html
 * <kb-avatar-group max="3" size="md">
 *   <kb-avatar name="Alice"></kb-avatar>
 *   <kb-avatar name="Bob"></kb-avatar>
 *   <kb-avatar name="Carol"></kb-avatar>
 *   <kb-avatar name="Dave"></kb-avatar>
 * </kb-avatar-group>
 * ```
 */
export class KbAvatarGroup extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Maximum number of visible avatars before showing "+N". 0 = no limit. @defaultValue 0 */
  @property({ type: Number }) max: number = 0;
  /** Size propagated to child avatars. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Overlap spacing between avatars. @defaultValue 'md' */
  @property({ type: String }) spacing: AvatarGroupSpacing = 'md';

  private _excess = 0;

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    this._applyVisibility();
  }

  private _applyVisibility(): void {
    const avatars = Array.from(this.querySelectorAll('kb-avatar'));
    if (this.max > 0 && avatars.length > this.max) {
      this._excess = avatars.length - this.max;
      for (let i = 0; i < avatars.length; i++) {
        const el = avatars[i] as HTMLElement;
        el.setAttribute('size', this.size);
        if (i >= this.max) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
      }
    } else {
      this._excess = 0;
      for (const el of avatars) {
        (el as HTMLElement).setAttribute('size', this.size);
        (el as HTMLElement).style.display = '';
      }
    }
  }

  override render(): TemplateResult {
    const overlapClass = OVERLAP_MAP[this.spacing] ?? OVERLAP_MAP.md;
    const classes = this.buildClasses('inline-flex items-center', overlapClass);
    const excessClasses = EXCESS_SIZE[this.size] ?? EXCESS_SIZE.md;

    return html`<div class=${classes}>
			${this.defaultSlotContent}${
        this._excess > 0
          ? html`<span
						class="inline-flex items-center justify-center shrink-0 font-sans font-semibold border border-current bg-gray-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300 ${excessClasses}"
						>+${this._excess}</span
					>`
          : ''
      }
		</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-avatar-group': KbAvatarGroup;
  }
}
