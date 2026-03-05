import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import { arrayHasChanged } from '../../utils/has-changed.js';

export interface SegmentOption<V extends string = string> {
  readonly value: V;
  readonly label: string;
  readonly disabled?: boolean;
}

const SIZE_PX: Record<ComponentSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
  xl: 'px-6 py-3 text-base',
} as const satisfies Record<ComponentSize, string>;

/**
 * Segmented control (mutually exclusive toggle group) for selecting a single value from a set of options.
 *
 * @fires kb-change - Fires when the selected value changes. Detail: `{ source: 'segment', value: string }`.
 *
 * @example
 * ```html
 * <kb-segment
 *   value="list"
 *   .options=${[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
 * ></kb-segment>
 * ```
 */
export class KbSegment<V extends string = string> extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Currently selected value. @defaultValue '' */
  @property({ type: String }) value: V | '' = '';
  /** Options to render as segments. */
  @property({ type: Array, hasChanged: arrayHasChanged }) options: readonly SegmentOption<V>[] = [];
  /** Display size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Disable all segments. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Form field name. */
  @property({ type: String }) name?: string;

  private _handleSelect(value: V): void {
    if (this.disabled) return;
    if (value === this.value) return;
    this.value = value;
    this.emit('kb-change', { source: 'segment', value });
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    const enabled = this.options.filter((o) => !o.disabled);
    if (enabled.length === 0) return;
    const currentIdx = enabled.findIndex((o) => o.value === this.value);
    let nextIdx = currentIdx;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIdx = currentIdx < enabled.length - 1 ? currentIdx + 1 : 0;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIdx = currentIdx > 0 ? currentIdx - 1 : enabled.length - 1;
        break;
      case 'Home':
        e.preventDefault();
        nextIdx = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIdx = enabled.length - 1;
        break;
      default:
        return;
    }

    const opt = enabled[nextIdx];
    if (opt && opt.value !== this.value) {
      this._handleSelect(opt.value);
      const buttons = this.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      const allOpts = this.options;
      const globalIdx = allOpts.indexOf(opt);
      buttons[globalIdx]?.focus();
    }
  }

  override render(): TemplateResult {
    const s = this.size;
    const outerClasses = this.buildClasses(
      'inline-flex items-stretch',
      kbClasses.border,
      this.disabled ? kbClasses.disabledLook : '',
    );

    return html`
      <div
        class=${outerClasses}
        role="radiogroup"
        aria-label="Segment control"
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @keydown=${this._handleKeyDown}
      >
        ${this.options.map((opt, i) => {
          const isSelected = opt.value === this.value;
          const isDisabled = this.disabled || (opt.disabled ?? false);
          const btnClasses = cx(
            'font-sans font-medium select-none',
            kbClasses.transitionColors,
            SIZE_PX[s],
            isSelected
              ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : `${kbClasses.surface} ${kbClasses.textPrimary} hover:bg-gray-100 dark:hover:bg-zinc-800`,
            isDisabled && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
            i > 0 ? `border-l ${kbClasses.borderColor}` : '',
          );
          return html`<button
            type="button"
            role="radio"
            class=${btnClasses}
            aria-checked=${isSelected ? 'true' : 'false'}
            aria-disabled=${isDisabled ? 'true' : 'false'}
            tabindex=${isSelected ? '0' : '-1'}
            ?disabled=${isDisabled}
            @click=${(): void => this._handleSelect(opt.value)}
          >${opt.label}</button>`;
        })}
      </div>
      ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-segment': KbSegment;
  }
}
