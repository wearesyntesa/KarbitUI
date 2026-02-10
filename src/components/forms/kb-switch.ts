import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize } from '../../core/types.js';

type LabelPosition = 'left' | 'right';

const SIZE_MAP: Record<ComponentSize, {
  track: string;
  thumb: string;
  translate: string;
  label: string;
  description: string;
  gap: string;
  icon: string;
  spinner: string;
}> = {
  xs: { track: 'w-6 h-3', thumb: 'w-3 h-3', translate: 'translate-x-3', label: 'text-xs', description: 'text-[10px]', gap: 'gap-1.5', icon: 'w-1.5 h-1.5', spinner: 'w-1.5 h-1.5 border' },
  sm: { track: 'w-8 h-4', thumb: 'w-4 h-4', translate: 'translate-x-4', label: 'text-sm', description: 'text-xs', gap: 'gap-2', icon: 'w-2 h-2', spinner: 'w-2 h-2 border' },
  md: { track: 'w-10 h-5', thumb: 'w-5 h-5', translate: 'translate-x-5', label: 'text-sm', description: 'text-xs', gap: 'gap-2.5', icon: 'w-2.5 h-2.5', spinner: 'w-2.5 h-2.5 border' },
  lg: { track: 'w-12 h-6', thumb: 'w-6 h-6', translate: 'translate-x-6', label: 'text-base', description: 'text-sm', gap: 'gap-3', icon: 'w-3 h-3', spinner: 'w-3 h-3 border-2' },
  xl: { track: 'w-14 h-7', thumb: 'w-7 h-7', translate: 'translate-x-7', label: 'text-lg', description: 'text-sm', gap: 'gap-3.5', icon: 'w-3.5 h-3.5', spinner: 'w-3.5 h-3.5 border-2' },
};

/** Checked track background per color scheme. */
const COLOR_SCHEME_TRACK: Record<string, string> = {
  blue: 'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500',
  red: 'bg-red-500 border-red-500 dark:bg-red-600 dark:border-red-600',
  green: 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600',
  yellow: 'bg-yellow-500 border-yellow-500 dark:bg-yellow-500 dark:border-yellow-500',
  black: 'bg-gray-900 border-gray-900 dark:bg-zinc-100 dark:border-zinc-100',
};

/** Unchecked hover border per color scheme. */
const COLOR_SCHEME_HOVER: Record<string, string> = {
  blue: 'group-hover/sw:border-blue-400 dark:group-hover/sw:border-blue-400',
  red: 'group-hover/sw:border-red-400 dark:group-hover/sw:border-red-400',
  green: 'group-hover/sw:border-green-400 dark:group-hover/sw:border-green-400',
  yellow: 'group-hover/sw:border-yellow-400 dark:group-hover/sw:border-yellow-400',
  black: 'group-hover/sw:border-gray-600 dark:group-hover/sw:border-zinc-300',
};

/** Icon color inside thumb per color scheme (used when checked). */
const COLOR_SCHEME_ICON: Record<string, string> = {
  blue: 'text-blue-500 dark:text-blue-500',
  red: 'text-red-500 dark:text-red-600',
  green: 'text-green-500 dark:text-green-600',
  yellow: 'text-yellow-500 dark:text-yellow-500',
  black: 'text-gray-900 dark:text-zinc-100',
};

const DEFAULT_TRACK = 'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500';
const DEFAULT_HOVER = 'group-hover/sw:border-gray-500 dark:group-hover/sw:border-zinc-400';
const DEFAULT_ICON = 'text-blue-500 dark:text-blue-500';

/**
 * Toggle switch with colorScheme, description slot, animated thumb, optional icons,
 * loading state, label positioning, invalid state, and press feedback.
 *
 * @slot - Label content.
 * @slot description - Helper text rendered below the label.
 *
 * @fires kb-change - Checked state changed. Detail: `{ checked: boolean }`.
 *
 * @example
 * ```html
 * <kb-switch checked color-scheme="green" show-icons>
 *   Dark Mode
 *   <span slot="description">Enable dark mode across the application</span>
 * </kb-switch>
 * ```
 */
@customElement('kb-switch')
export class KbSwitch extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: Boolean, reflect: true }) checked: boolean = false;
  @property({ type: Boolean }) disabled: boolean = false;
  @property({ type: Boolean }) invalid: boolean = false;
  @property({ type: Boolean }) loading: boolean = false;
  @property({ type: Boolean, attribute: 'show-icons' }) showIcons: boolean = false;
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  @property({ type: String, attribute: 'label-position' }) labelPosition: LabelPosition = 'right';
  @property({ type: String }) name?: string;

  @state() private _pressed: boolean = false;

  private _handleToggle(): void {
    if (this.disabled || this.loading) return;
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('kb-change', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.key === ' ') {
      e.preventDefault();
      this._handleToggle();
    }
  }

  override render() {
    const s = SIZE_MAP[this.size];
    const descSlot = this.slotted('description');
    const isDisabled = this.disabled || this.loading;

    // Track classes
    const trackChecked = this.colorScheme
      ? COLOR_SCHEME_TRACK[this.colorScheme] ?? DEFAULT_TRACK
      : DEFAULT_TRACK;

    const trackUncheckedHover = !isDisabled && !this.checked
      ? (this.colorScheme
          ? COLOR_SCHEME_HOVER[this.colorScheme] ?? DEFAULT_HOVER
          : DEFAULT_HOVER)
      : '';

    const trackInvalid = this.invalid && !this.checked
      ? 'border-red-500 dark:border-red-500'
      : '';

    const trackClasses = [
      s.track,
      'border relative inline-flex items-center shrink-0',
      'transition-all duration-200',
      this.checked
        ? trackChecked
        : `bg-gray-200 border-gray-300 dark:bg-zinc-700 dark:border-zinc-600 ${trackUncheckedHover}`,
      trackInvalid,
      this._pressed && !isDisabled ? 'scale-95' : '',
      'focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2',
    ].filter(Boolean).join(' ');

    // Thumb classes — bouncy overshoot transition
    const thumbClasses = [
      s.thumb,
      'absolute left-0 flex items-center justify-center',
      'bg-white dark:bg-zinc-200',
      'transition-transform duration-200',
      this.checked ? s.translate : 'translate-x-0',
    ].join(' ');

    // Thumb icon (check when on, X when off)
    const iconColor = this.checked
      ? (this.colorScheme ? COLOR_SCHEME_ICON[this.colorScheme] ?? DEFAULT_ICON : DEFAULT_ICON)
      : kbClasses.textMuted;

    const thumbContent = this.loading
      ? html`<span class="${s.spinner} rounded-full border-current border-t-transparent animate-spin" style="border-style:solid"></span>`
      : this.showIcons
        ? (this.checked
            ? html`<svg class="${s.icon} ${iconColor}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`
            : html`<svg class="${s.icon} ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`)
        : nothing;

    // Label + description
    const hasLabel = this.defaultSlotContent.length > 0;
    const labelBlock = hasLabel || descSlot
      ? html`<span class="flex flex-col gap-0.5">
          ${hasLabel ? html`<span class="${s.label} ${kbClasses.textPrimary}">${this.defaultSlotContent}</span>` : nothing}
          ${descSlot ? html`<span class="${s.description} ${this.invalid ? 'text-red-500 dark:text-red-400' : kbClasses.textSecondary}">${descSlot}</span>` : nothing}
        </span>`
      : nothing;

    // Wrapper
    const wrapperClasses = this.buildClasses(
      `group/sw inline-flex items-center font-sans ${s.gap} select-none`,
      isDisabled ? kbClasses.disabled : 'cursor-pointer',
      this.labelPosition === 'left' ? 'flex-row-reverse' : '',
    );

    return html`
      <label
        class=${wrapperClasses}
        @pointerdown=${() => { if (!isDisabled) this._pressed = true; }}
        @pointerup=${() => { this._pressed = false; }}
        @pointerleave=${() => { this._pressed = false; }}
      >
        <input
          type="checkbox"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
          .checked=${this.checked}
          ?disabled=${isDisabled}
          name=${this.name ?? ''}
        />
        <span
          class=${trackClasses}
          role="switch"
          tabindex=${isDisabled ? '-1' : '0'}
          aria-checked=${this.checked ? 'true' : 'false'}
          @click=${() => this._handleToggle()}
          @keydown=${(e: KeyboardEvent) => this._handleKeydown(e)}
        >
          <span class=${thumbClasses} style="transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)">
            ${thumbContent}
          </span>
        </span>
        ${labelBlock}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-switch': KbSwitch;
  }
}
