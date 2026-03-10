import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize, Orientation } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

type StepStatus = 'complete' | 'current' | 'upcoming';

const INDICATOR_SIZE: Record<ComponentSize, string> = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
} as const satisfies Record<ComponentSize, string>;

const INDICATOR_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const satisfies Record<ComponentSize, string>;

const LABEL_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-base',
} as const satisfies Record<ComponentSize, string>;

const DESCRIPTION_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-xs',
  xl: 'text-sm',
} as const satisfies Record<ComponentSize, string>;

const CONNECTOR_GAP: Record<ComponentSize, string> = {
  xs: 'mx-1',
  sm: 'mx-1.5',
  md: 'mx-2',
  lg: 'mx-3',
  xl: 'mx-4',
} as const satisfies Record<ComponentSize, string>;

const CONNECTOR_GAP_VERTICAL: Record<ComponentSize, string> = {
  xs: 'my-0.5',
  sm: 'my-1',
  md: 'my-1',
  lg: 'my-1.5',
  xl: 'my-2',
} as const satisfies Record<ComponentSize, string>;

const CHECKMARK_SVG: TemplateResult = html`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3/5 h-3/5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;

/**
 * Individual step item within a `<kb-steps>` wizard/progress indicator.
 *
 * @slot description - Optional description text displayed below the label.
 */
export class KbStep extends KbBaseElement<'description'> {
  static override hostDisplay = 'block' as const;

  /** Step label text. */
  @property({ type: String }) label: string = '';

  @property({ type: String }) _status: StepStatus = 'upcoming';
  @property({ type: Number }) _index: number = 0;
  @property({ type: String }) _size: ComponentSize = 'md';
  @property({ type: String }) _orientation: Orientation = 'horizontal';
  @property({ type: Boolean }) _isLast: boolean = false;

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has('_orientation')) {
      this.style.flex = this._orientation === 'horizontal' ? '1' : '';
    }
  }

  private _handleClick(): void {
    if (this._status === 'complete') {
      this.emit('kb-step-click', { index: this._index });
    }
  }

  private _renderIndicator(): TemplateResult {
    const status = this._status;
    const size = this._size;

    const baseClasses = cx(
      'flex items-center justify-center shrink-0 font-mono',
      INDICATOR_SIZE[size],
      INDICATOR_TEXT[size],
      kbClasses.transitionColors,
    );

    if (status === 'complete') {
      return html`<div
        class=${cx(baseClasses, 'bg-blue-500 text-white border border-blue-500')}
        style="border-radius:9999px"
      >${CHECKMARK_SVG}</div>`;
    }

    if (status === 'current') {
      return html`<div
        class=${cx(baseClasses, 'border-2 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 bg-transparent')}
        style="border-radius:9999px"
      >${this._index + 1}</div>`;
    }

    return html`<div
      class=${cx(baseClasses, 'border border-gray-300 dark:border-zinc-600 text-gray-400 dark:text-zinc-500 bg-transparent')}
      style="border-radius:9999px"
    >${this._index + 1}</div>`;
  }

  private _renderConnector(): TemplateResult | typeof nothing {
    if (this._isLast) return nothing;

    const status = this._status;
    const isComplete = status === 'complete';

    if (this._orientation === 'vertical') {
      return html`<div
        class=${cx(
          'w-px min-h-8 self-stretch',
          CONNECTOR_GAP_VERTICAL[this._size],
          isComplete ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-zinc-700',
        )}
      ></div>`;
    }

    return html`<div
      class=${cx(
        'flex-1 h-px self-center',
        CONNECTOR_GAP[this._size],
        isComplete ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-zinc-700',
      )}
    ></div>`;
  }

  private _renderLabel(): TemplateResult {
    const status = this._status;
    const size = this._size;
    const descEl = this.slotted('description');

    const labelClasses = cx(
      'font-sans font-medium',
      LABEL_TEXT[size],
      status === 'upcoming' ? kbClasses.textMuted : kbClasses.textPrimary,
    );

    const descClasses = cx(
      DESCRIPTION_TEXT[size],
      status === 'upcoming' ? kbClasses.textMuted : kbClasses.textSecondary,
    );

    return html`<div class="flex flex-col">
      <span class=${labelClasses}>${this.label}</span>
      ${descEl ? html`<span class=${descClasses}>${descEl}</span>` : nothing}
    </div>`;
  }

  override render(): TemplateResult {
    const isVertical = this._orientation === 'vertical';
    const isClickable = this._status === 'complete';

    const wrapperClasses = cx('flex', isVertical ? 'flex-row items-start' : 'flex-col items-center flex-1');

    const stepClasses = cx(
      'flex items-center gap-2',
      isVertical ? 'flex-row' : 'flex-col',
      isClickable && 'cursor-pointer',
    );

    return html`<div class=${wrapperClasses}>
      <div class=${cx('flex', isVertical ? 'flex-col items-center' : 'flex-row items-center w-full')}>
        <div
          class=${stepClasses}
          @click=${isClickable ? this._handleClick : undefined}
          role=${isClickable ? 'button' : 'presentation'}
          tabindex=${isClickable ? '0' : nothing}
        >
          ${this._renderIndicator()}
          ${this._renderLabel()}
        </div>
        ${this._renderConnector()}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-step': KbStep;
  }
}
