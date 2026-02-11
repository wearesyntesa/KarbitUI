import { html, nothing, type TemplateResult } from 'lit';
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
export class KbRadioGroup extends KbBaseElement<'label'> {
  static override hostDisplay = 'block' as const;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('kb-change', this._onChildChange as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('kb-change', this._onChildChange as EventListener);
  }

  /** Layout direction of the grouped radios. @defaultValue 'vertical' */
  @property({ type: String }) direction: Orientation = 'vertical';
  /** Form field name propagated to child radios that don't set their own. */
  @property({ type: String }) name?: string;
  /** Size propagated to child radios that don't set their own size. */
  @property({ type: String }) size?: ComponentSize;
  /** Color scheme propagated to child radios that don't set their own. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Currently selected value. Reflects the checked radio's value. Can be set programmatically. */
  @property({ type: String }) value?: string;

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

    this.value = ce.detail.value;
    this.emit('kb-change', { source: 'radio-group', value: ce.detail.value });
  };

  override firstUpdated(): void {
    const radios = this._getRadios();
    for (const radio of radios) {
      if (this.name && !radio.hasAttribute('name')) radio.name = this.name;
      // biome-ignore lint/style/useExplicitLengthCheck: .size is a component variant prop, not a collection size
      if (this.size && !radio.hasAttribute('size')) radio.size = this.size;
      if (this.colorScheme && !radio.hasAttribute('color-scheme')) radio.colorScheme = this.colorScheme;
    }
    const checked = radios.find((r) => r.checked);
    if (checked) this.value = checked.value;
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (changed.has('value') && changed.get('value') !== undefined && this.value !== undefined) {
      for (const radio of this._getRadios()) {
        radio.checked = radio.value === this.value;
      }
    }
  }

  override render(): TemplateResult {
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
