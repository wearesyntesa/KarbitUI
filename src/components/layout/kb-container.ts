import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { DimensionValue } from '../../core/types.js';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

const SIZE_MAP: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
} as const satisfies Record<ContainerSize, string>;

/**
 * Centered content container with a configurable max-width.
 *
 * Use the `size` prop for named presets, or `max` for a custom Tailwind
 * max-width value. When both are set, `size` takes precedence.
 *
 * @slot - Default slot for child content.
 *
 * @example
 * ```html
 * <kb-container size="lg" center>
 *   <p>Centered content within a large container.</p>
 * </kb-container>
 * <kb-container max="4xl">
 *   <p>Custom max-width.</p>
 * </kb-container>
 * ```
 */
export class KbContainer extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Named max-width preset. Takes precedence over `max` when set. */
  @property({ type: String }) size?: ContainerSize;
  /** Custom Tailwind max-width value (e.g. `'4xl'`, `'prose'`). Ignored if `size` is set. */
  @property({ type: String }) max?: DimensionValue;
  /** Horizontally center the container with `mx-auto`. @defaultValue true */
  @property({ type: Boolean, reflect: true }) center: boolean = true;

  override render(): TemplateResult {
    let maxClass: string;
    // biome-ignore lint/style/useExplicitLengthCheck: .size is a component variant prop, not a collection size
    if (this.size) maxClass = SIZE_MAP[this.size];
    else if (this.max) maxClass = `max-w-${this.max}`;
    else maxClass = 'max-w-7xl';

    const centerClass = this.center ? 'mx-auto' : '';
    const classes = this.buildClasses('w-full', 'px-4', maxClass, centerClass);
    return html`<div class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-container': KbContainer;
  }
}
