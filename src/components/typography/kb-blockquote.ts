import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type BlockquoteVariant = 'default' | 'plain';

const ACCENT_MAP: Partial<Record<ColorScheme, string>> = {
  gray: 'border-gray-400 dark:border-zinc-500',
  red: 'border-red-500 dark:border-red-400',
  orange: 'border-orange-500 dark:border-orange-400',
  yellow: 'border-yellow-500 dark:border-yellow-400',
  green: 'border-green-500 dark:border-green-400',
  blue: 'border-blue-500 dark:border-blue-400',
  purple: 'border-purple-500 dark:border-purple-400',
  pink: 'border-pink-500 dark:border-pink-400',
};

const DEFAULT_ACCENT = 'border-gray-300 dark:border-zinc-600';

/**
 * Styled blockquote with a left accent border, optional citation,
 * and structured minimal styling.
 *
 * @slot - Blockquote body content.
 * @slot cite - Citation text displayed below the body.
 *
 * @example
 * ```html
 * <kb-blockquote color-scheme="blue">
 *   Design is not just what it looks like. Design is how it works.
 *   <span slot="cite">Steve Jobs</span>
 * </kb-blockquote>
 * ```
 */
export class KbBlockquote extends KbBaseElement<'cite'> {
  static override hostDisplay = 'block' as const;

  /** Visual variant. @defaultValue 'default' */
  @property({ type: String }) variant: BlockquoteVariant = 'default';
  /** Accent color for the left border. @defaultValue 'gray' */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;

  override render(): TemplateResult {
    const accent = this.colorScheme ? (ACCENT_MAP[this.colorScheme] ?? DEFAULT_ACCENT) : DEFAULT_ACCENT;

    const isPlain = this.variant === 'plain';

    const outerClasses = this.buildClasses('border-l-2', accent, isPlain ? 'pl-4' : 'pl-4 py-1');

    const bodyClasses = cx('text-sm font-sans italic', kbClasses.textPrimary);

    const citeEl = this.slotted('cite');

    return html`
      <blockquote class=${outerClasses}>
        <div class=${bodyClasses}>${this.defaultSlotContent}</div>
        ${
          citeEl
            ? html`<footer class=${cx('mt-2 font-mono text-xs not-italic', kbClasses.textSecondary)}>
              — ${citeEl}
            </footer>`
            : nothing
        }
      </blockquote>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-blockquote': KbBlockquote;
  }
}
