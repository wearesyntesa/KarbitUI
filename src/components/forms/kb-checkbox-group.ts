import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
export class KbCheckboxGroup extends KbBaseElement {
  static override hostDisplay = 'block';

  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
    this.addEventListener('kb-change', this._onChildChange as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('kb-change', this._onChildChange as EventListener);
  }

  @property({ type: String }) direction: Orientation = 'vertical';
  @property({ type: String }) size?: ComponentSize;
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  @property({ type: Number }) min?: number;
  @property({ type: Number }) max?: number;

  @state() private _values: string[] = [];

  private _getCheckboxes(): KbCheckbox[] {
    return Array.from(this.querySelectorAll('kb-checkbox')) as KbCheckbox[];
  }

  private _syncValues(): void {
    this._values = this._getCheckboxes()
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

    this.dispatchEvent(new CustomEvent('kb-change', {
      detail: { values: [...this._values] },
      bubbles: true,
      composed: true,
    }));
  };

  override firstUpdated(): void {
    const checkboxes = this._getCheckboxes();
    for (const cb of checkboxes) {
      if (this.size && !cb.hasAttribute('size')) cb.size = this.size;
      if (this.colorScheme && !cb.hasAttribute('color-scheme')) cb.colorScheme = this.colorScheme;
    }
    this._syncValues();
  }

  override render() {
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
