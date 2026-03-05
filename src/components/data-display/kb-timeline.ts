import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

export interface TimelineItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly timestamp?: string;
  readonly status?: 'info' | 'success' | 'warning' | 'error' | 'default';
  readonly active?: boolean;
}

export type TimelineVariant = 'left' | 'alternate';
export type TimelineLineVariant = 'solid' | 'dashed';

/** Status border colors for the indicator square. */
const STATUS_BORDER: Record<string, string> = {
  default: 'border-gray-300 dark:border-zinc-600',
  info: 'border-blue-500 dark:border-blue-400',
  success: 'border-green-500 dark:border-green-400',
  warning: 'border-yellow-500 dark:border-yellow-400',
  error: 'border-red-500 dark:border-red-400',
};

/** Status fill colors for active indicators. */
const STATUS_FILL: Record<string, string> = {
  default: 'bg-gray-300 dark:bg-zinc-600',
  info: 'bg-blue-500 dark:bg-blue-400',
  success: 'bg-green-500 dark:bg-green-400',
  warning: 'bg-yellow-500 dark:bg-yellow-400',
  error: 'bg-red-500 dark:bg-red-400',
};

/** Status icon text color (used when indicator is not filled). */
const STATUS_ICON_COLOR: Record<string, string> = {
  default: 'text-gray-400 dark:text-zinc-500',
  info: 'text-blue-500 dark:text-blue-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-500 dark:text-red-400',
};

/** Active item accent border for the content area. */
const ACTIVE_ACCENT: string = 'border-l-2 border-blue-500 dark:border-blue-400 pl-3';

interface SizeTokens {
  readonly text: string;
  readonly title: string;
  readonly indicator: string;
  readonly iconSvg: string;
  readonly gap: string;
  readonly pb: string;
  readonly lineOffset: string;
}

const SIZE_MAP: Record<ComponentSize, SizeTokens> = {
  xs: {
    text: 'text-xs',
    title: 'text-xs font-semibold',
    indicator: 'w-5 h-5',
    iconSvg: 'w-2.5 h-2.5',
    gap: 'gap-3',
    pb: 'pb-6',
    lineOffset: 'left-[0.5625rem]',
  },
  sm: {
    text: 'text-xs',
    title: 'text-sm font-semibold',
    indicator: 'w-6 h-6',
    iconSvg: 'w-3 h-3',
    gap: 'gap-3',
    pb: 'pb-6',
    lineOffset: 'left-[0.6875rem]',
  },
  md: {
    text: 'text-sm',
    title: 'text-sm font-semibold',
    indicator: 'w-7 h-7',
    iconSvg: 'w-3.5 h-3.5',
    gap: 'gap-4',
    pb: 'pb-8',
    lineOffset: 'left-[0.8125rem]',
  },
  lg: {
    text: 'text-base',
    title: 'text-base font-semibold',
    indicator: 'w-8 h-8',
    iconSvg: 'w-4 h-4',
    gap: 'gap-4',
    pb: 'pb-10',
    lineOffset: 'left-[0.9375rem]',
  },
  xl: {
    text: 'text-base',
    title: 'text-lg font-semibold',
    indicator: 'w-9 h-9',
    iconSvg: 'w-4 h-4',
    gap: 'gap-5',
    pb: 'pb-12',
    lineOffset: 'left-[1.0625rem]',
  },
} as const satisfies Record<ComponentSize, SizeTokens>;

const LINE_SOLID: string = 'border-l border-gray-200 dark:border-zinc-700';
const LINE_DASHED: string = 'border-l border-dashed border-gray-200 dark:border-zinc-700';

/**
 * Vertical timeline for displaying sequential events with square indicators,
 * status icons, hover states, and click interaction.
 *
 * Each item renders as a bordered square indicator on a continuous vertical line,
 * with title, description, and optional timestamp.
 *
 * @fires kb-timeline-item-click - Dispatched when a timeline item is clicked, with `detail.index` and `detail.id`.
 *
 * @example
 * ```html
 * <kb-timeline .items=${[
 *   { id: '1', title: 'Started', status: 'info', timestamp: '08:00' },
 *   { id: '2', title: 'Completed', status: 'success', timestamp: '08:05' },
 * ]} show-icons></kb-timeline>
 * ```
 */
export class KbTimeline extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Timeline items to display. */
  @property({ type: Array }) items: TimelineItem[] = [];

  /** Layout variant. */
  @property({ type: String }) variant: TimelineVariant = 'left';

  /** Size of the timeline. */
  @property({ type: String }) size: ComponentSize = 'md';

  /** Line style variant. */
  @property({ type: String, attribute: 'line-variant' }) lineVariant: TimelineLineVariant = 'solid';

  /** Show status icons inside indicator squares. */
  @property({ type: Boolean, attribute: 'show-icons' }) showIcons: boolean = false;

  private _tokens: SizeTokens = SIZE_MAP.md;

  override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (this._tokens === SIZE_MAP.md || changed.has('size')) {
      this._tokens = SIZE_MAP[this.size] ?? SIZE_MAP.md;
    }
  }

  private _handleItemClick(item: TimelineItem, index: number): void {
    this.emit('kb-timeline-item-click', { index, id: item.id });
  }

  // -- Render helpers: indicator -------------------------------------------

  private _renderStatusIcon(status: string): TemplateResult {
    const cls: string = this._tokens.iconSvg;
    if (status === 'success') {
      return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>`;
    }
    if (status === 'error') {
      return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
    }
    if (status === 'warning') {
      return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 9v4m0 4h.01"/></svg>`;
    }
    if (status === 'info') {
      return html`<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 16v-4m0-4h.01"/></svg>`;
    }
    return html`<span class="block w-1.5 h-1.5 bg-current"></span>`;
  }

  private _renderIndicator(item: TimelineItem): TemplateResult {
    const status: string = item.status ?? 'default';
    const borderColor = STATUS_BORDER[status] ?? STATUS_BORDER.default;
    const isActive: boolean = item.active === true;

    let fillAndText: string;
    if (isActive) {
      const fill = STATUS_FILL[status] ?? STATUS_FILL.default;
      fillAndText = `${fill} text-white dark:text-zinc-950`;
    } else {
      const iconColor = STATUS_ICON_COLOR[status] ?? STATUS_ICON_COLOR.default;
      fillAndText = `${kbClasses.surface} ${iconColor}`;
    }

    const cls: string = cx(
      this._tokens.indicator,
      'relative z-10 flex items-center justify-center border',
      borderColor,
      fillAndText,
      kbClasses.transitionColors,
    );

    if (this.showIcons) {
      return html`<div class=${cls}>${this._renderStatusIcon(status)}</div>`;
    }
    return html`<div class=${cls}><span class="block w-1.5 h-1.5 bg-current"></span></div>`;
  }

  // -- Render helpers: content ---------------------------------------------

  private _renderContent(item: TimelineItem): TemplateResult {
    const t = this._tokens;
    const isActive: boolean = item.active === true;
    const accentCls: string = isActive ? ACTIVE_ACCENT : '';

    return html`
      <div class=${cx(accentCls)}>
        <div class=${cx(t.title, kbClasses.textPrimary)}>${item.title}</div>
        ${
          item.description
            ? html`<div class="${cx(t.text, kbClasses.textSecondary, 'mt-1')}">${item.description}</div>`
            : nothing
        }
        ${
          item.timestamp
            ? html`<div class="${cx('font-sans tabular-nums mt-1', kbClasses.textMuted, t.text)}">${item.timestamp}</div>`
            : nothing
        }
      </div>
    `;
  }

  // -- Render helpers: items -----------------------------------------------

  private _renderLeftItem(item: TimelineItem, index: number, isLast: boolean): TemplateResult {
    const t = this._tokens;
    const lineClasses: string = this.lineVariant === 'dashed' ? LINE_DASHED : LINE_SOLID;
    const contentPb: string = isLast ? '' : t.pb;

    return html`
      <div
        class=${cx('flex', t.gap, 'cursor-pointer group/tl')}
        role="button"
        tabindex="0"
        aria-label=${item.title}
        @click=${(): void => this._handleItemClick(item, index)}
        @keydown=${(e: KeyboardEvent): void => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._handleItemClick(item, index);
          }
        }}
      >
        <div class="relative flex flex-col items-center shrink-0">
          ${isLast ? nothing : html`<div class="absolute top-0 bottom-0 ${t.lineOffset} ${lineClasses}"></div>`}
          ${this._renderIndicator(item)}
        </div>
        <div class=${cx('min-w-0 flex-1 pt-0.5 -mt-px', contentPb, 'group-hover/tl:bg-gray-50 dark:group-hover/tl:bg-zinc-800/50 px-3 -mx-1', kbClasses.transitionColors)}>
          ${this._renderContent(item)}
        </div>
      </div>
    `;
  }

  private _renderAlternateItem(item: TimelineItem, index: number, isLast: boolean): TemplateResult {
    const t = this._tokens;
    const lineClasses: string = this.lineVariant === 'dashed' ? LINE_DASHED : LINE_SOLID;
    const isRight: boolean = index % 2 === 0;
    const contentPb: string = isLast ? '' : t.pb;

    const contentBlock: TemplateResult = html`
      <div
        class=${cx('min-w-0 flex-1 pt-0.5 -mt-px cursor-pointer', contentPb, 'hover:bg-gray-50 dark:hover:bg-zinc-800/50 px-3', kbClasses.transitionColors, isRight ? 'text-right' : '')}
        role="button"
        tabindex="0"
        aria-label=${item.title}
        @click=${(): void => this._handleItemClick(item, index)}
        @keydown=${(e: KeyboardEvent): void => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._handleItemClick(item, index);
          }
        }}
      >
        ${this._renderContent(item)}
      </div>
    `;

    const spacer: TemplateResult = html`<div class="hidden md:block md:flex-1"></div>`;

    const centerColumn: TemplateResult = html`
      <div class="relative flex flex-col items-center shrink-0">
        ${isLast ? nothing : html`<div class="absolute top-0 bottom-0 ${t.lineOffset} ${lineClasses}"></div>`}
        ${this._renderIndicator(item)}
      </div>
    `;

    if (isRight) {
      return html`<div class=${cx('flex', t.gap)}>${contentBlock}${centerColumn}${spacer}</div>`;
    }
    return html`<div class=${cx('flex', t.gap)}>${spacer}${centerColumn}${contentBlock}</div>`;
  }

  // -- Main render ---------------------------------------------------------

  override render(): TemplateResult {
    const containerClasses: string = this.buildClasses('flex flex-col');
    const isAlternate: boolean = this.variant === 'alternate';
    const lastIndex: number = this.items.length - 1;

    return html`<div class=${containerClasses}>
      ${this.items.map((item: TimelineItem, index: number): TemplateResult => {
        const isLast: boolean = index === lastIndex;
        if (isAlternate) {
          return this._renderAlternateItem(item, index, isLast);
        }
        return this._renderLeftItem(item, index, isLast);
      })}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-timeline': KbTimeline;
  }
}
