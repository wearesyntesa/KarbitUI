import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { Orientation, SpacingValue } from '../../core/types.js';
import './kb-divider.js';

/**
 * Linear stack layout. Arranges children vertically or horizontally with consistent spacing.
 *
 * Set `divider` to automatically insert `<kb-divider>` elements between children.
 *
 * @slot - Default slot for child content.
 *
 * @example
 * ```html
 * <kb-stack direction="vertical" spacing="4">
 *   <kb-box>Item 1</kb-box>
 *   <kb-box>Item 2</kb-box>
 * </kb-stack>
 * <kb-stack spacing="4" divider>
 *   <div>Section A</div>
 *   <div>Section B</div>
 * </kb-stack>
 * ```
 */
@customElement('kb-stack')
export class KbStack extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Stack direction. `'vertical'` stacks top-to-bottom, `'horizontal'` left-to-right. @defaultValue 'vertical' */
  @property({ type: String }) direction: Orientation = 'vertical';
  /** Gap between children as a Tailwind spacing value (e.g. `'4'`, `'8'`). */
  @property({ type: String }) spacing?: SpacingValue;
  /** Insert `<kb-divider>` elements between children automatically. @defaultValue false */
  @property({ type: Boolean }) divider: boolean = false;

  private _dividerCache: Array<Node | TemplateResult> | null = null;
  private _dividerCacheKey: Node[] | null = null;

  private _interleaveWithDividers(nodes: Node[]): Array<Node | TemplateResult> {
    if (nodes === this._dividerCacheKey && this._dividerCache !== null) {
      return this._dividerCache;
    }
    const isHorizontal = this.direction === 'horizontal';
    const dividerOrientation = isHorizontal ? 'vertical' : 'horizontal';
    const result: Array<Node | TemplateResult> = [];
    for (let i = 0; i < nodes.length; i++) {
      if (i > 0) {
        result.push(html`<kb-divider orientation=${dividerOrientation}></kb-divider>`);
      }
      result.push(nodes[i] as Node);
    }
    this._dividerCacheKey = nodes;
    this._dividerCache = result;
    return result;
  }

  override render(): TemplateResult {
    const isHorizontal = this.direction === 'horizontal';
    const dirClass = isHorizontal ? 'flex-row' : 'flex-col';
    const spacingClass = this.spacing ? `gap-${this.spacing}` : '';
    const stretchClass = this.divider && isHorizontal ? 'items-stretch' : '';

    const classes = this.buildClasses('flex', dirClass, spacingClass, stretchClass);
    const content = this.divider ? this._interleaveWithDividers(this.defaultSlotContent) : this.defaultSlotContent;

    return html`<div class=${classes}>${content}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-stack': KbStack;
  }
}
