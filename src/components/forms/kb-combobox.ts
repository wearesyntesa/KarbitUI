import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import {
  CLEAR_SIZE,
  FORM_CLEAR_CLASSES,
  FORM_DISABLED_CONTROL,
  FORM_INPUT_BASE,
  FORM_PLACEHOLDER,
  type FormVariant,
  SIZE_GAP,
  SIZE_PADDING,
  SIZE_TEXT,
  VARIANT_WRAPPER,
  VARIANT_WRAPPER_INVALID,
} from '../../core/form-tokens.js';
import { renderCloseIcon } from '../../core/icons.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import { arrayHasChanged } from '../../utils/has-changed.js';
import type { SelectOption } from './kb-select.js';

const PANEL_ID_PREFIX = 'kb-combo-panel-';
const OPTION_ID_PREFIX = 'kb-combo-opt-';

let instanceCounter = 0;

/**
 * Searchable combobox dropdown. The trigger contains a text input that filters options as you type.
 *
 * @fires kb-change - Value changed. Detail: `{ source: 'combobox', value: string }`.
 * @fires kb-input - Search text changed. Detail: `{ value: string }`.
 * @fires kb-focus - Focused.
 * @fires kb-blur - Blurred.
 * @fires kb-clear - Cleared.
 *
 * @example
 * ```html
 * <kb-combobox
 *   placeholder="Search..."
 *   clearable
 *   .options=${[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
 * ></kb-combobox>
 * ```
 */
export class KbCombobox<V extends string = string> extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Display size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Placeholder text. */
  @property({ type: String }) placeholder?: string;
  /** Currently selected value. @defaultValue '' */
  @property({ type: String }) value: V | '' = '';
  /** Form field name. */
  @property({ type: String }) name?: string;
  /** Array of selectable options. */
  @property({ type: Array, hasChanged: arrayHasChanged }) options: readonly SelectOption<V>[] = [];
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Show clear button. @defaultValue false */
  @property({ type: Boolean }) clearable: boolean = false;
  /** Text shown when no options match. @defaultValue 'No results' */
  @property({ type: String, attribute: 'empty-text' }) emptyText: string = 'No results';

  @state() private _open: boolean = false;
  @state() private _query: string = '';
  @state() private _highlightedIndex: number = -1;

  private _instanceId: number;
  private readonly _panelId: string;
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _docListenersActive = false;
  private _cachedCloseIcon: TemplateResult | null = null;

  constructor() {
    super();
    this._instanceId = instanceCounter++;
    this._panelId = `${PANEL_ID_PREFIX}${this._instanceId}`;
  }

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (this._cachedCloseIcon === null || changed.has('size')) {
      this._cachedCloseIcon = renderCloseIcon(CLEAR_SIZE[this.size]);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._detachDocListeners();
  }

  private _getFiltered(): readonly SelectOption<V>[] {
    if (!this._query) return this.options;
    const q = this._query.toLowerCase();
    return this.options.filter((o) => o.label.toLowerCase().includes(q));
  }

  private _getSelectedLabel(): string {
    const match = this.options.find((o) => o.value === this.value);
    return match?.label ?? '';
  }

  private _attachDocListeners(): void {
    if (this._docListenersActive) return;
    document.addEventListener('mousedown', this._boundOutsideClick, true);
    this._docListenersActive = true;
  }

  private _detachDocListeners(): void {
    if (!this._docListenersActive) return;
    document.removeEventListener('mousedown', this._boundOutsideClick, true);
    this._docListenersActive = false;
  }

  private _handleOutsideClick(e: MouseEvent): void {
    if (!this._open) return;
    if (!this.contains(e.target as Node)) this._close();
  }

  private _openPanel(): void {
    if (this.disabled) return;
    this._attachDocListeners();
    this._open = true;
    this._highlightedIndex = -1;
    requestAnimationFrame(() => {
      const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
      if (panel) {
        panel
          .animate(
            [
              { opacity: 0, transform: 'scale(0.97)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: prefersReducedMotion() ? 0 : 120, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' },
          )
          .finished.then(
            (a) => {
              a.commitStyles();
              a.cancel();
            },
            (_e: unknown) => {
              /* cancelled — no-op */
            },
          );
      }
    });
  }

  private _close(): void {
    if (!this._open) return;
    const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
    if (panel) {
      const anim = panel.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.97)' },
        ],
        { duration: prefersReducedMotion() ? 0 : 80, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
      );
      anim.finished.then(
        () => {
          anim.commitStyles();
          anim.cancel();
          this._finishClose();
        },
        () => this._finishClose(),
      );
    } else {
      this._finishClose();
    }
  }

  private _finishClose(): void {
    this._open = false;
    this._query = '';
    this._highlightedIndex = -1;
    this._detachDocListeners();
  }

  private _selectOption(opt: SelectOption<V>): void {
    this.value = opt.value;
    this._close();
    this.emit('kb-change', { source: 'combobox', value: opt.value });
    this._focusInput();
  }

  private _handleClear(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.value = '';
    this._query = '';
    this.emit('kb-change', { source: 'combobox', value: '' });
    this.emit('kb-clear');
    this._focusInput();
  }

  private _focusInput(): void {
    const input = this.querySelector<HTMLInputElement>('input[type="text"]');
    input?.focus();
  }

  private _handleInputFocus(): void {
    if (!this._open) this._openPanel();
    this.emit('kb-focus');
  }

  private _handleInputBlur(e: FocusEvent): void {
    const related = e.relatedTarget as Node | null;
    if (related && this.contains(related)) return;
    if (this._open) this._close();
    this.emit('kb-blur');
  }

  private _handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this._query = target.value;
    this._highlightedIndex = -1;
    if (!this._open) this._openPanel();
    this.emit('kb-input', { value: target.value });
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    const filtered = this._getFiltered();

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!this._open) {
          this._openPanel();
          return;
        }
        if (filtered.length === 0) return;
        this._highlightedIndex = this._findNextEnabled(filtered, this._highlightedIndex, 1);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!this._open) return;
        this._highlightedIndex = this._findNextEnabled(filtered, this._highlightedIndex, -1);
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (this._open && this._highlightedIndex >= 0) {
          const opt = filtered[this._highlightedIndex];
          if (opt && !opt.disabled) this._selectOption(opt);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        if (this._open) this._close();
        break;
      }
      case 'Tab': {
        if (this._open) this._close();
        break;
      }
      default:
        break;
    }
  }

  private _findNextEnabled(filtered: readonly SelectOption<V>[], fromIndex: number, direction: 1 | -1): number {
    const len = filtered.length;
    let idx = fromIndex + direction;
    while (idx >= 0 && idx < len) {
      if (!filtered[idx]?.disabled) return idx;
      idx += direction;
    }
    return fromIndex;
  }

  private _optionId(index: number): string {
    return `${OPTION_ID_PREFIX}${this._instanceId}-${index}`;
  }

  private _renderChevron(): TemplateResult {
    const chevronRotate = this._open ? 'rotate-180' : 'rotate-0';
    return html`<span class="shrink-0 flex items-center pointer-events-none select-none ${kbClasses.textMuted} transition-transform duration-200 ease-in-out ${chevronRotate}">
      <svg class="${CLEAR_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>
    </span>`;
  }

  private _renderPanel(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const filtered = this._getFiltered();
    const panelClasses = cx(
      'absolute z-50 left-0 right-0 top-full mt-1',
      'max-h-60 overflow-y-auto py-1',
      kbClasses.surface,
      kbClasses.border,
    );

    return html`<div
      id=${this._panelId}
      role="listbox"
      class=${panelClasses}
      @mousedown=${(e: Event): void => e.preventDefault()}
    >${
      filtered.length === 0
        ? html`<div class=${cx(SIZE_PADDING[this.size], SIZE_TEXT[this.size], kbClasses.textMuted, 'select-none')}>${this.emptyText}</div>`
        : filtered.map((opt, i) => {
            const isSelected = opt.value === this.value;
            const isHighlighted = i === this._highlightedIndex;
            const optClasses = cx(
              'flex items-center justify-between cursor-pointer select-none',
              SIZE_PADDING[this.size],
              SIZE_TEXT[this.size],
              opt.disabled && 'opacity-40 cursor-not-allowed',
              !opt.disabled && isSelected && isHighlighted && 'bg-blue-500 text-white',
              !opt.disabled && isSelected && !isHighlighted && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
              !(opt.disabled || isSelected) && isHighlighted && `${kbClasses.surfaceMuted} ${kbClasses.textPrimary}`,
              !(opt.disabled || isSelected || isHighlighted) && kbClasses.textPrimary,
              kbClasses.transitionColors,
            );
            return html`<div
              id=${this._optionId(i)}
              role="option"
              class=${optClasses}
              aria-selected=${isSelected ? 'true' : 'false'}
              aria-disabled=${opt.disabled ? 'true' : 'false'}
              data-value=${opt.value}
              data-index=${i}
              @click=${(): void => {
                if (!opt.disabled) this._selectOption(opt);
              }}
              @mousemove=${(): void => {
                if (!opt.disabled && i !== this._highlightedIndex) this._highlightedIndex = i;
              }}
            ><span class="truncate">${opt.label}</span>${isSelected ? this._renderCheckIcon() : nothing}</div>`;
          })
    }</div>`;
  }

  private _renderCheckIcon(): TemplateResult {
    return html`<svg class="${CLEAR_SIZE[this.size]} shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`;
  }

  override render(): TemplateResult {
    const s = this.size;
    const isFlushed = this.variant === 'flushed';
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];
    const hasValue = this.value !== '';

    const outerClasses = this.buildClasses(
      'relative flex items-stretch w-full font-sans',
      kbClasses.transitionColors,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const innerClasses = cx('flex items-center flex-1', SIZE_PADDING[s], SIZE_GAP[s], isFlushed ? wrapperBorder : '');

    const inputValue = this._open ? this._query : hasValue ? this._getSelectedLabel() : '';

    return html`
      <div class=${outerClasses}>
        <div class=${innerClasses}>
          <input
            type="text"
            class=${cx(FORM_INPUT_BASE, FORM_PLACEHOLDER, SIZE_TEXT[s], kbClasses.textPrimary)}
            .value=${inputValue}
            placeholder=${this.placeholder ?? ''}
            ?disabled=${this.disabled}
            aria-invalid=${this.invalid ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-expanded=${this._open ? 'true' : 'false'}
            aria-controls=${this._open ? this._panelId : nothing}
            aria-activedescendant=${this._highlightedIndex >= 0 ? this._optionId(this._highlightedIndex) : nothing}
            role="combobox"
            autocomplete="off"
            @input=${this._handleInput}
            @focus=${this._handleInputFocus}
            @blur=${this._handleInputBlur}
            @keydown=${this._handleKeyDown}
          />
          ${this.clearable && hasValue && !this.disabled ? html`<button class="${FORM_CLEAR_CLASSES}" @click=${this._handleClear} type="button" aria-label="Clear selection" tabindex="-1">${this._cachedCloseIcon}</button>` : nothing}
          ${this._renderChevron()}
        </div>
        ${this._renderPanel()}
        ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-combobox': KbCombobox;
  }
}
