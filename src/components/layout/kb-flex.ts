import type { PropertyValues } from 'lit';
import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { FlexAlignValue, FlexDirectionValue, FlexJustifyValue, FlexWrapValue } from '../../core/types.js';

/**
 * Flexbox layout container. Shorthand for `<kb-box display="flex">`.
 *
 * @slot - Default slot for child content.
 *
 * @example
 * ```html
 * <kb-flex direction="row" gap="4" align="center" justify="between">
 *   <span>A</span>
 *   <span>B</span>
 * </kb-flex>
 * ```
 */
@customElement('kb-flex')
export class KbFlex extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Flex direction. Maps to the `flexDir` style prop. @defaultValue undefined (browser default: row) */
  @property({ type: String }) direction?: FlexDirectionValue;
  /** Cross-axis alignment. Maps to the `alignItems` style prop. */
  @property({ type: String }) align?: FlexAlignValue;
  /** Main-axis alignment. Maps to the `justifyContent` style prop. */
  @property({ type: String }) justify?: FlexJustifyValue;
  /** Flex wrapping behavior. Maps to the `flexWrap` style prop. */
  @property({ type: String }) wrap?: FlexWrapValue;

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const self = this as unknown as Record<string, unknown>;
    if (changed.has('direction')) self.flexDir = this.direction;
    if (changed.has('align')) self.alignItems = this.align;
    if (changed.has('justify')) self.justifyContent = this.justify;
    if (changed.has('wrap')) self.flexWrap = this.wrap;
  }

  override render(): TemplateResult {
    const classes = this.buildClasses('flex');
    return html`<div class=${classes}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-flex': KbFlex;
  }
}
