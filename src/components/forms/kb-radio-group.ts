import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, Orientation } from '../../core/types.js';
import type { KbRadio } from './kb-radio.js';

/**
 * Groups `kb-radio` elements, enforces single selection,
 * and propagates shared props to children.
 *
 * @slot - `kb-radio` children.
 * @slot label - Group label rendered above the radios.
 *
 * @fires kb-change - Selection changed. Detail: `{ value: string }`.
 *
 * @example
 * ```html
 * <kb-radio-group name="plan" direction="vertical" color-scheme="green">
 *   <span slot="label">Select a plan</span>
 *   <kb-radio value="free">Free</kb-radio>
 *   <kb-radio value="pro" checked>Pro</kb-radio>
 *   <kb-radio value="enterprise">Enterprise</kb-radio>
 * </kb-radio-group>
 * ```
 */
@customElement('kb-radio-group')
export class KbRadioGroup extends KbBaseElement {
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
  @property({ type: String }) name?: string;
  @property({ type: String }) size?: ComponentSize;
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;

  private _getRadios(): KbRadio[] {
    return Array.from(this.querySelectorAll('kb-radio')) as KbRadio[];
  }

  private _onChildChange = (e: Event): void => {
    const ce = e as CustomEvent<{ checked: boolean; value: string }>;
    const target = ce.target as KbRadio;

    if (!target || target.tagName !== 'KB-RADIO') return;

    e.stopPropagation();

    if (!ce.detail.checked) return;

    for (const radio of this._getRadios()) {
      if (radio !== target && radio.checked) {
        radio.checked = false;
      }
    }

    this.dispatchEvent(new CustomEvent('kb-change', {
      detail: { value: ce.detail.value },
      bubbles: true,
      composed: true,
    }));
  };

  override firstUpdated(): void {
    const radios = this._getRadios();
    for (const radio of radios) {
      if (this.name && !radio.hasAttribute('name')) radio.name = this.name;
      if (this.size && !radio.hasAttribute('size')) radio.size = this.size;
      if (this.colorScheme && !radio.hasAttribute('color-scheme')) radio.colorScheme = this.colorScheme;
    }
  }

  override render() {
    const labelEl = this.slotted('label');
    const dirClass = this.direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col';

    const wrapperClasses = this.buildClasses('flex flex-col gap-2');

    return html`
      <div class=${wrapperClasses} role="radiogroup" aria-label=${labelEl?.textContent?.trim() ?? nothing}>
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
    'kb-radio-group': KbRadioGroup;
  }
}
