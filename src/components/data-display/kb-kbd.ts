import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { type InferVariant, recipe } from '../../core/recipe.js';
import { kbClasses } from '../../core/theme.js';
import { cx } from '../../utils/cx.js';

// biome-ignore lint/nursery/useExplicitType: type inferred from recipe generic
const kbdRecipe = recipe({
  base: cx(
    'inline-flex items-center justify-center',
    'font-mono font-medium whitespace-nowrap',
    'bg-gray-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
    kbClasses.border,
    kbClasses.transitionColors,
  ),
  variants: {
    size: {
      sm: 'px-1 py-px text-[10px] min-w-5 h-5',
      md: 'px-1.5 py-0.5 text-xs min-w-6 h-6',
      lg: 'px-2 py-1 text-sm min-w-7 h-7',
    },
  },
  defaultVariants: { size: 'md' },
});

export type KbdSize = InferVariant<typeof kbdRecipe, 'size'>;

/**
 * Keyboard key indicator for displaying keyboard shortcuts.
 *
 * Renders an inline `<kbd>` element styled as a key cap.
 *
 * @example
 * ```html
 * <kb-kbd>Ctrl</kb-kbd> + <kb-kbd>S</kb-kbd>
 * <kb-kbd size="lg">Enter</kb-kbd>
 * ```
 */
export class KbKbd extends KbBaseElement {
  /** Key cap size. @defaultValue 'md' */
  @property({ type: String }) size: KbdSize = 'md';

  override render(): TemplateResult {
    const classes = this.buildClasses(kbdRecipe({ size: this.size }));

    return html`<kbd class=${classes}>${this.defaultSlotContent}</kbd>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-kbd': KbKbd;
  }
}
