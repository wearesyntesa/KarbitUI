import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, Orientation } from '../../core/types.js';
import type { KbRadio } from './kb-radio.js';

let rgGroupCounter = 0;

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

  private readonly _labelId: string = `kb-rg-label-${rgGroupCounter++}`;
  private _childObserver: MutationObserver | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('kb-change', this._onChildChange as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);
    this._childObserver = new MutationObserver(() => {
      this._propagatePropsToChildren();
    });
    this._childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('kb-change', this._onChildChange as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    this._childObserver?.disconnect();
    this._childObserver = undefined;
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
  /** Mark the group as required — propagated to child radios and exposed as `aria-required` on the group. @defaultValue false */
  @property({ type: Boolean }) required: boolean = false;

  private _getRadios(): KbRadio[] {
    return Array.from(this.querySelectorAll('kb-radio')) as KbRadio[];
  }

  private _onChildChange = (e: Event): void => {
    const ce = e as CustomEvent<{ checked: boolean; value: string }>;
    const target = ce.target as KbRadio;

    if (!target || target.tagName !== 'KB-RADIO') return;

    e.stopPropagation();

    if (!ce.detail.checked) return;

    const radios = this._getRadios();
    for (const radio of radios) {
      if (radio !== target && radio.checked) {
        radio.checked = false;
      }
    }

    this.value = ce.detail.value;
    this.emit('kb-change', { source: 'radio-group', value: ce.detail.value });
    this._updateRovingTabIndex(radios);
  };

  /** Keeps only the checked (or first) radio focusable; others get tabindex="-1". */
  private _updateRovingTabIndex(radios?: KbRadio[]): void {
    const all = radios ?? this._getRadios();
    const checkedIdx = all.findIndex((r) => r.checked);
    const focusIdx = checkedIdx >= 0 ? checkedIdx : 0;
    all.forEach((radio, i) => {
      const circle = radio.circleEl;
      if (circle) circle.tabIndex = i === focusIdx ? 0 : -1;
    });
  }

  private _onKeyDown = (e: KeyboardEvent): void => {
    const allRadios = this._getRadios();
    const radios = allRadios.filter((r) => !r.disabled);
    if (radios.length === 0) return;

    const isHoriz = this.direction === 'horizontal';
    const nextKey = isHoriz ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHoriz ? 'ArrowLeft' : 'ArrowUp';

    if (e.key !== nextKey && e.key !== prevKey) return;

    e.preventDefault();

    const focused = allRadios.findIndex((r) => r.circleEl === document.activeElement);
    if (focused < 0) return;

    const enabledIndices = allRadios.reduce<number[]>((acc, r, i) => {
      if (!r.disabled) acc.push(i);
      return acc;
    }, []);

    const posInEnabled = enabledIndices.indexOf(focused);
    if (posInEnabled < 0) return;

    const delta = e.key === nextKey ? 1 : -1;
    const nextPos = (posInEnabled + delta + enabledIndices.length) % enabledIndices.length;
    const nextIndex = enabledIndices[nextPos];
    if (nextIndex === undefined) return;

    const nextRadio = allRadios[nextIndex];
    if (!nextRadio) return;

    nextRadio.checked = true;
    nextRadio.emit('kb-change', { checked: true, value: nextRadio.value, source: 'radio' });
    const circle = nextRadio.circleEl;
    circle?.focus();
  };

  override firstUpdated(): void {
    this._propagatePropsToChildren();
    const radios = this._getRadios();
    const checked = radios.find((r) => r.checked);
    if (checked) this.value = checked.value;
    this._updateRovingTabIndex(radios);
  }

  /** Push group-level props to child radios that don't have explicit overrides. */
  private _propagatePropsToChildren(): void {
    const radios = this._getRadios();
    for (const radio of radios) {
      if (this.name && !radio.hasAttribute('name')) radio.name = this.name;
      // biome-ignore lint/style/useExplicitLengthCheck: .size is a component variant prop, not a collection size
      if (this.size && !radio.hasAttribute('size')) radio.size = this.size;
      if (this.colorScheme && !radio.hasAttribute('color-scheme')) radio.colorScheme = this.colorScheme;
      if (this.required && !radio.hasAttribute('required')) radio.required = true;
    }
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (changed.has('value') && changed.get('value') !== undefined && this.value !== undefined) {
      const radios = this._getRadios();
      for (const radio of radios) {
        radio.checked = radio.value === this.value;
      }
    }
  }

  override render(): TemplateResult {
    const labelEl = this.slotted('label');
    const dirClass = this.direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col';

    const wrapperClasses = this.buildClasses('flex flex-col gap-2');

    return html`
      <div class=${wrapperClasses} role="radiogroup" aria-labelledby=${labelEl ? this._labelId : nothing} aria-required=${this.required ? 'true' : nothing}>
        ${labelEl ? html`<span id=${this._labelId} class="${kbClasses.label} select-none mb-1">${labelEl}</span>` : nothing}
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
