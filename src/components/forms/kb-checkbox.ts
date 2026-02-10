import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ColorScheme, ComponentSize, KnownColorScheme } from '../../core/types.js';
import type { KbChangeCheckboxDetail } from '../../core/events.js';
import { lookupScheme } from '../../core/color-schemes.js';

const SIZE_MAP: Record<ComponentSize, {
  box: string;
  label: string;
  icon: string;
  description: string;
}> = {
  xs: { box: 'w-3.5 h-3.5', label: 'text-xs gap-1.5', icon: 'w-2.5 h-2.5', description: 'text-[10px]' },
  sm: { box: 'w-4 h-4', label: 'text-sm gap-2', icon: 'w-3 h-3', description: 'text-xs' },
  md: { box: 'w-5 h-5', label: 'text-sm gap-2.5', icon: 'w-3.5 h-3.5', description: 'text-xs' },
  lg: { box: 'w-6 h-6', label: 'text-base gap-3', icon: 'w-4 h-4', description: 'text-sm' },
  xl: { box: 'w-7 h-7', label: 'text-lg gap-3.5', icon: 'w-5 h-5', description: 'text-sm' },
};

const COLOR_SCHEME_CHECKED: Record<KnownColorScheme, string> = {
  blue: 'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500',
  red: 'bg-red-500 border-red-500 dark:bg-red-600 dark:border-red-600',
  green: 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600',
  yellow: 'bg-yellow-500 border-yellow-500 dark:bg-yellow-500 dark:border-yellow-500',
  black: 'bg-gray-900 border-gray-900 dark:bg-zinc-100 dark:border-zinc-100',
};

const COLOR_SCHEME_ICON: Record<KnownColorScheme, string> = {
  blue: 'text-white',
  red: 'text-white',
  green: 'text-white',
  yellow: 'text-black dark:text-black',
  black: 'text-white dark:text-zinc-900',
};

const COLOR_SCHEME_HOVER: Record<KnownColorScheme, string> = {
  blue: 'group-hover/cb:border-blue-400 dark:group-hover/cb:border-blue-400',
  red: 'group-hover/cb:border-red-400 dark:group-hover/cb:border-red-400',
  green: 'group-hover/cb:border-green-400 dark:group-hover/cb:border-green-400',
  yellow: 'group-hover/cb:border-yellow-400 dark:group-hover/cb:border-yellow-400',
  black: 'group-hover/cb:border-gray-600 dark:group-hover/cb:border-zinc-300',
};

const DEFAULT_CHECKED = 'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500';
const DEFAULT_ICON = 'text-white';
const DEFAULT_HOVER = 'group-hover/cb:border-gray-500 dark:group-hover/cb:border-zinc-400';

/**
 * Checkbox control with SVG icons, animated state transitions, colorScheme support,
 * description slot, invalid state, and press feedback.
 *
 * @slot - Label content.
 * @slot description - Helper text rendered below the label.
 *
 * @fires kb-change - Checked state changed. Detail: `{ checked: boolean, value?: string }`.
 *
 * @example
 * ```html
 * <kb-checkbox checked color-scheme="green">
 *   Accept terms
 *   <span slot="description">You must accept to continue.</span>
 * </kb-checkbox>
 * ```
 */
@customElement('kb-checkbox')
export class KbCheckbox extends KbBaseElement {
  /** Checkbox size controlling box dimensions, label text, and icon size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Whether the checkbox is checked. Reflects to the `checked` attribute. @defaultValue false */
  @property({ type: Boolean, reflect: true }) checked: boolean = false;
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Show a horizontal dash icon instead of a checkmark (third state). @defaultValue false */
  @property({ type: Boolean }) indeterminate: boolean = false;
  /** Apply error border styling when unchecked. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Color scheme for the checked/indeterminate state background and icon. */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;
  /** Form field name, used in form submissions. */
  @property({ type: String }) name?: string;
  /** Value included in `kb-change` event detail and form submissions. */
  @property({ type: String }) value?: string;

  @state() private _pressed = false;

  private _toggle(): void {
    if (this.disabled) return;
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    this.dispatchEvent(new CustomEvent<KbChangeCheckboxDetail>('kb-change', {
      detail: { source: 'checkbox', checked: this.checked, value: this.value ?? '' },
      bubbles: true,
      composed: true,
    }));
  }

  private _onPointerDown(): void {
    if (!this.disabled) this._pressed = true;
  }

  private _onPointerUp(): void {
    this._pressed = false;
  }

  override render() {
    const s = SIZE_MAP[this.size];
    const isActive = this.checked || this.indeterminate;
    const cs = this.colorScheme;

    const checkedBg = isActive
      ? lookupScheme(COLOR_SCHEME_CHECKED, cs) ?? DEFAULT_CHECKED
      : 'bg-white dark:bg-transparent';

    const iconColor = isActive
      ? lookupScheme(COLOR_SCHEME_ICON, cs) ?? DEFAULT_ICON
      : '';

    const hoverBorder = !isActive && !this.disabled
      ? lookupScheme(COLOR_SCHEME_HOVER, cs) ?? DEFAULT_HOVER
      : '';

    const borderColor = this.invalid && !isActive
      ? 'border-red-500 dark:border-red-400'
      : isActive
        ? ''
        : 'border-gray-300 dark:border-zinc-600';

    const boxClasses = [
      s.box,
      'border flex items-center justify-center shrink-0',
      'transition-all duration-150 ease-in-out',
      checkedBg,
      iconColor,
      borderColor,
      hoverBorder,
      this._pressed ? 'scale-90' : '',
      kbClasses.focus,
    ].filter(Boolean).join(' ');

    const wrapperClasses = this.buildClasses(
      'group/cb inline-flex items-start font-sans select-none',
      kbClasses.textPrimary,
      s.label,
      this.disabled ? kbClasses.disabled : 'cursor-pointer',
    );

    const descriptionEl = this.slotted('description');

    const checkIcon = this.indeterminate
      ? html`<svg class="${s.icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M5 12h14" class="animate-kb-check-draw" style="stroke-dasharray:14;stroke-dashoffset:0"/></svg>`
      : isActive
        ? html`<svg class="${s.icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M5 12l5 5L19 7" class="animate-kb-check-draw" style="stroke-dasharray:24;stroke-dashoffset:0"/></svg>`
        : nothing;

    const labelContent = descriptionEl
      ? html`<span class="flex flex-col gap-0.5">
          <span>${this.defaultSlotContent}</span>
          <span class="${s.description} ${this.invalid ? 'text-red-500 dark:text-red-400' : kbClasses.textSecondary}">${descriptionEl}</span>
        </span>`
      : this.defaultSlotContent;

    return html`
      <label
        class=${wrapperClasses}
        @click=${(e: MouseEvent) => { e.preventDefault(); this._toggle(); }}
        @pointerdown=${() => this._onPointerDown()}
        @pointerup=${() => this._onPointerUp()}
        @pointerleave=${() => this._onPointerUp()}
      >
        <input
          type="checkbox"
          class="sr-only"
          .checked=${this.checked}
          .indeterminate=${this.indeterminate}
          ?disabled=${this.disabled}
          name=${this.name ?? ''}
          value=${this.value ?? ''}
          tabindex="-1"
          aria-hidden="true"
        />
        <span
          class=${boxClasses}
          tabindex=${this.disabled ? '-1' : '0'}
          role="checkbox"
          aria-checked=${this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false'}
          aria-invalid=${this.invalid ? 'true' : nothing}
          @keydown=${(e: KeyboardEvent) => { if (e.key === ' ') { e.preventDefault(); this._toggle(); } }}
        >
          ${checkIcon}
        </span>
        ${labelContent}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-checkbox': KbCheckbox;
  }
}
