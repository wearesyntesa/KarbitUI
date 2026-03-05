import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export type DataListOrientation = 'horizontal' | 'vertical';

export interface DataListItem {
  readonly label: string;
  readonly value: string;
}

const SIZE_CLASSES: Record<ComponentSize, { gap: string; labelText: string; valueText: string }> = {
  xs: { gap: 'gap-1', labelText: 'text-[10px]', valueText: 'text-xs' },
  sm: { gap: 'gap-1.5', labelText: 'text-xs', valueText: 'text-xs' },
  md: { gap: 'gap-2', labelText: 'text-xs', valueText: 'text-sm' },
  lg: { gap: 'gap-2.5', labelText: 'text-xs', valueText: 'text-sm' },
  xl: { gap: 'gap-3', labelText: 'text-sm', valueText: 'text-base' },
} as const satisfies Record<ComponentSize, { gap: string; labelText: string; valueText: string }>;

/**
 * Key-value description list for displaying structured data pairs.
 *
 * @slot - Default slot for custom content (overrides `items` prop).
 *
 * @example
 * ```html
 * <kb-data-list .items=${[
 *   { label: 'Name', value: 'Project Alpha' },
 *   { label: 'Status', value: 'Active' },
 *   { label: 'Created', value: '2026-01-15' },
 * ]}></kb-data-list>
 * ```
 */
export class KbDataList extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Array of key-value pairs to render. */
  @property({ type: Array }) items: readonly DataListItem[] = [];
  /** Layout direction for each item pair. @defaultValue 'horizontal' */
  @property({ type: String }) orientation: DataListOrientation = 'horizontal';
  /** Sizing preset. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Show a divider between items. @defaultValue false */
  @property({ type: Boolean }) divider: boolean = false;

  override render(): TemplateResult {
    const s = SIZE_CLASSES[this.size] ?? SIZE_CLASSES.md;
    const isHorizontal = this.orientation === 'horizontal';

    const wrapperClasses = this.buildClasses('font-sans');

    const itemClasses = cx(
      isHorizontal ? `flex items-baseline justify-between ${s.gap}` : `flex flex-col ${s.gap}`,
      this.divider ? `py-2.5 border-b ${kbClasses.borderColor} last:border-b-0` : 'py-1.5',
    );

    const labelClasses = cx(s.labelText, 'uppercase tracking-widest font-mono select-none', kbClasses.textSecondary);

    const valueClasses = cx(s.valueText, kbClasses.textPrimary, isHorizontal ? 'text-right' : '');

    return html`
      <dl class=${wrapperClasses}>
        ${this.items.map(
          (item) => html`
            <div class=${itemClasses}>
              <dt class=${labelClasses}>${item.label}</dt>
              <dd class=${valueClasses}>${item.value}</dd>
            </div>
          `,
        )}
        ${this.defaultSlotContent}
      </dl>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-data-list': KbDataList;
  }
}
