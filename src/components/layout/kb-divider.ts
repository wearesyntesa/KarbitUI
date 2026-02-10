import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { Orientation, ColorValue } from '../../core/types.js';

/**
 * Visual separator between content sections.
 *
 * @example
 * ```html
 * <kb-divider orientation="horizontal" />
 * <kb-divider orientation="vertical" divider-color="slate-300" />
 * ```
 */
@customElement('kb-divider')
export class KbDivider extends KbBaseElement {
  static override hostDisplay = 'block';
  @property({ type: String }) orientation: Orientation = 'horizontal';
  @property({ type: String, attribute: 'divider-color' }) dividerColor?: ColorValue;

  override render() {
    const isHorizontal = this.orientation === 'horizontal';
    const orientationClasses = isHorizontal
      ? 'w-full h-0 border-t'
      : 'h-full w-0 border-l';

    const colorClass = this.dividerColor
      ? `border-${this.dividerColor}`
      : 'border-gray-200 dark:border-zinc-700';

    const classes = this.buildClasses(orientationClasses, colorClass);
    return html`<div role="separator" aria-orientation=${this.orientation} class=${classes}></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-divider': KbDivider;
  }
}
