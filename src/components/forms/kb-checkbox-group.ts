import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, Orientation } from '../../core/types.js';
import type { KbCheckbox } from './kb-checkbox.js';

/**
 * Groups `kb-checkbox` elements, tracks selected values,
 * and optionally enforces min/max selection constraints.
 *
 * @slot - `kb-checkbox` children.
 * @slot label - Group label rendered above the checkboxes.
 *
 * @fires kb-change - Selection changed. Detail: `{ values: string[] }`.
 *
 * @example
 * ```html
 * <kb-checkbox-group direction="vertical" max="3">
 *   <span slot="label">Choose toppings</span>
 *   <kb-checkbox value="cheese">Cheese</kb-checkbox>
 *   <kb-checkbox value="onion">Onion</kb-checkbox>
 *   <kb-checkbox value="pepper">Pepper</kb-checkbox>
 * </kb-checkbox-group>
 * ```
 */
@customElement('kb-checkbox-group')
export class KbCheckboxGroup extends KbBaseElement<'label'> {
  static override hostDisplay = 'block' as const;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('kb-change', this._onChildChange as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('kb-change', this._onChildChange as EventListener);
  }

  /** Layout direction of the grouped checkboxes. @defaultValue 'vertical' */
  @property({ type: String }) direction: Orientation = 'vertical';
  /** Size propagated to child checkboxes that don't set their own size. */
  @property({ type: String }) size?: ComponentSize;
  /** Color scheme propagated to child checkboxes that don't set their own. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Minimum number of checkboxes that must remain checked. */
  @property({ type: Number }) min?: number;
  /** Maximum number of checkboxes that can be checked simultaneously. */
  @property({ type: Number }) max?: number;
  /** Currently checked values. Reflects child checkbox states. Can be set programmatically. */
  @property({ type: Array }) values: string[] = [];

  private _getCheckboxes(): KbCheckbox[] {
    return Array.from(this.querySelectorAll('kb-checkbox')) as KbCheckbox[];
  }

  private _syncValues(): void {
    this.values = this._getCheckboxes()
      .filter((cb) => cb.checked)
      .map((cb) => cb.value ?? '');
  }

  private _onChildChange = (e: Event): void => {
    const ce = e as CustomEvent<{ checked: boolean; value?: string }>;
    const target = ce.target as KbCheckbox;

    if (!target || target.tagName !== 'KB-CHECKBOX') return;

    e.stopPropagation();

    const checkboxes = this._getCheckboxes();
    const checkedCount = checkboxes.filter((cb) => cb.checked).length;

    if (this.max !== undefined && ce.detail.checked && checkedCount > this.max) {
      target.checked = false;
      return;
    }

    if (this.min !== undefined && !ce.detail.checked && checkedCount < this.min) {
      target.checked = true;
      return;
    }

    this._syncValues();

    this.emit('kb-change', { source: 'checkbox-group', values: [...this.values] });
  };

  override firstUpdated(): void {
    const checkboxes = this._getCheckboxes();
    for (const cb of checkboxes) {
      // biome-ignore lint/style/useExplicitLengthCheck: .size is a component variant prop, not a collection size
      if (this.size && !cb.hasAttribute('size')) cb.size = this.size;
      if (this.colorScheme && !cb.hasAttribute('color-scheme')) cb.colorScheme = this.colorScheme;
    }
    this._syncValues();
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (changed.has('values') && changed.get('values') !== undefined) {
      const valSet = new Set(this.values);
      for (const cb of this._getCheckboxes()) {
        cb.checked = valSet.has(cb.value ?? '');
      }
    }
  }

  override render(): TemplateResult {
    const labelEl = this.slotted('label');
    const dirClass = this.direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col';

    const wrapperClasses = this.buildClasses('flex flex-col gap-2');

    return html`
      <div class=${wrapperClasses} role="group" aria-label=${labelEl?.textContent?.trim() ?? nothing}>
        ${labelEl ? html`<span class="${kbClasses.label} mb-1">${labelEl}</span>` : nothing}
        <div class="flex ${dirClass} gap-3">
          ${this.defaultSlotContent}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-checkbox-group': KbCheckboxGroup;
  }
}
