import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

export type StatIndicator = 'increase' | 'decrease' | 'none';

const LABEL_SIZE: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const satisfies Record<ComponentSize, string>;

const VALUE_SIZE: Record<ComponentSize, string> = {
  xs: 'text-lg',
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
} as const satisfies Record<ComponentSize, string>;

const HELP_SIZE: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-[11px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
} as const satisfies Record<ComponentSize, string>;

const INDICATOR_ARROW: Record<Exclude<StatIndicator, 'none'>, string> = {
  increase: '\u25B2',
  decrease: '\u25BC',
} as const;

const INDICATOR_COLOR: Record<Exclude<StatIndicator, 'none'>, string> = {
  increase: 'text-green-600 dark:text-green-400',
  decrease: 'text-red-600 dark:text-red-400',
} as const;

/**
 * Statistic display showing a number, label, and optional change indicator.
 *
 * @slot icon - Optional icon displayed before the value.
 *
 * @example
 * ```html
 * <kb-stat label="Revenue" value="$12,450" help-text="+12.5% from last month" indicator="increase"></kb-stat>
 * <kb-stat label="Users" value="1,024" indicator="decrease" help-text="-3.2%"></kb-stat>
 * ```
 */
export class KbStat extends KbBaseElement<'icon'> {
  static override hostDisplay = 'block' as const;

  /** Descriptive label above the value. */
  @property({ type: String }) label: string = '';
  /** The main statistic value to display. */
  @property({ type: String }) value: string = '';
  /** Contextual help text displayed below the value (e.g. percentage change). */
  @property({ type: String, attribute: 'help-text' }) helpText?: string;
  /** Change direction indicator arrow. @defaultValue 'none' */
  @property({ type: String }) indicator: StatIndicator = 'none';
  /** Stat size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';

  private _cachedLabelSize = '';
  private _cachedValueSize = '';
  private _cachedHelpSize = '';

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this._cachedLabelSize === '' || changed.has('size')) {
      this._cachedLabelSize = LABEL_SIZE[this.size] ?? LABEL_SIZE.md;
      this._cachedValueSize = VALUE_SIZE[this.size] ?? VALUE_SIZE.md;
      this._cachedHelpSize = HELP_SIZE[this.size] ?? HELP_SIZE.md;
    }
  }

  override render(): TemplateResult {
    const containerClasses = this.buildClasses('flex flex-col gap-1');
    const iconSlot = this.slotted('icon');

    const indicatorEl =
      this.indicator !== 'none'
        ? html`<span class="${INDICATOR_COLOR[this.indicator]} ${this._cachedHelpSize}">${INDICATOR_ARROW[this.indicator]}</span>`
        : nothing;

    return html`<div class=${containerClasses}>
			${this.label ? html`<span class="${this._cachedLabelSize} ${kbClasses.label} font-mono uppercase tracking-wider">${this.label}</span>` : nothing}
			<div class="flex items-center gap-2">
				${iconSlot ? html`<span class="${this._cachedValueSize} ${kbClasses.textPrimary}">${iconSlot}</span>` : nothing}
				<span class="${this._cachedValueSize} font-semibold ${kbClasses.textPrimary}">${this.value}</span>
			</div>
			${
        this.helpText
          ? html`<div class="flex items-center gap-1">
						${indicatorEl}
						<span class="${this._cachedHelpSize} ${kbClasses.textSecondary}">${this.helpText}</span>
					</div>`
          : nothing
      }
		</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-stat': KbStat;
  }
}
