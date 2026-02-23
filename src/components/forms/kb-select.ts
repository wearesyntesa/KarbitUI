import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import {
  CLEAR_SIZE,
  FORM_CLEAR_CLASSES,
  FORM_DISABLED_CONTROL,
  type FormVariant,
  renderFormSpinner,
  SIZE_GAP,
  SIZE_ICON,
  SIZE_PADDING,
  SIZE_TEXT,
  SPINNER_SIZE,
  VARIANT_WRAPPER,
  VARIANT_WRAPPER_INVALID,
} from '../../core/form-tokens.js';
import { renderCloseIcon } from '../../core/icons.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import { arrayHasChanged } from '../../utils/has-changed.js';

export interface SelectOption<V extends string = string> {
  readonly value: V;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface SelectOptionGroup<V extends string = string> {
  readonly group: string;
  readonly options: readonly SelectOption<V>[];
}

export type SelectOptionOrGroup<V extends string = string> = SelectOption<V> | SelectOptionGroup<V>;

export function isOptionGroup<V extends string = string>(opt: SelectOptionOrGroup<V>): opt is SelectOptionGroup<V> {
  return 'group' in opt && 'options' in opt;
}

interface FlatOption {
  readonly value: string;
  readonly label: string;
  readonly disabled: boolean;
  readonly groupLabel?: string;
}

const PANEL_ID_PREFIX = 'kb-select-panel-';
const OPTION_ID_PREFIX = 'kb-select-opt-';
const TYPE_AHEAD_TIMEOUT_MS = 350;

let instanceCounter = 0;

/**
 * Custom-styled select dropdown with fully rendered panel, keyboard navigation,
 * ARIA listbox semantics, option groups, clearable, loading, and icon slot support.
 *
 * @slot icon - Leading icon element inside the select wrapper.
 *
 * @fires kb-change - Value changed. Detail: `{ value: string }`.
 * @fires kb-focus - Select focused.
 * @fires kb-blur - Select blurred.
 * @fires kb-clear - Clear button clicked (when clearable).
 *
 * @example
 * ```html
 * <kb-select
 *   placeholder="Choose..."
 *   clearable
 *   .options=${[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]}
 * >
 *   <span slot="icon"><svg>...</svg></span>
 * </kb-select>
 * ```
 */
@customElement('kb-select')
export class KbSelect<V extends string = string> extends KbBaseElement<'icon'> {
  /** Form select visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Select size controlling padding, font size, and icon sizing. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Placeholder text shown when no value is selected. */
  @property({ type: String }) placeholder?: string;
  /** Currently selected value. @defaultValue '' */
  @property({ type: String }) value: V | '' = '';
  /** Form field name, used in form submissions. */
  @property({ type: String }) name?: string;
  /** Array of options or option groups to render in the dropdown. */
  @property({ type: Array, hasChanged: arrayHasChanged }) options: readonly SelectOptionOrGroup<V>[] = [];
  /** Disable interaction and apply dimmed styling. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Mark the select as invalid with error border styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Mark the select as required for form validation. @defaultValue false */
  @property({ type: Boolean }) required: boolean = false;
  /** Show a clear button when a value is selected. @defaultValue false */
  @property({ type: Boolean }) clearable: boolean = false;
  /** Show a loading spinner in place of the chevron. @defaultValue false */
  @property({ type: Boolean }) loading: boolean = false;
  /** Text shown in the dropdown panel when there are no options. @defaultValue 'No results' */
  @property({ type: String, attribute: 'empty-text' }) emptyText: string = 'No results';

  @state() private _open: boolean = false;
  @state() private _highlightedIndex: number = -1;

  private _instanceId: number;
  private readonly _panelId: string;
  private _focused: boolean = false;
  private _flatCache: readonly FlatOption[] = [];
  private _flatCacheKey: readonly SelectOptionOrGroup[] = [];
  private _typeAheadBuffer: string = '';
  private _typeAheadTimer: ReturnType<typeof setTimeout> | null = null;
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _boundKeyDown = this._handleGlobalKeyDown.bind(this);
  private _docListenersActive = false;
  private _exitAnimation: Animation | null = null;
  private _enterAnimation: Animation | null = null;
  private _animatedIn: boolean = false;
  private _panelEl: HTMLElement | null = null;
  /** R-2: Cached close icon template, rebuilt when `size` changes. */
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
    this._clearTypeAhead();
    if (this._rafMouseMove !== null) {
      cancelAnimationFrame(this._rafMouseMove);
      this._rafMouseMove = null;
    }
    if (this._rafScroll !== null) {
      cancelAnimationFrame(this._rafScroll);
      this._rafScroll = null;
    }
    if (this._enterAnimation !== null) {
      this._enterAnimation.cancel();
      this._enterAnimation = null;
    }
    if (this._exitAnimation !== null) {
      this._exitAnimation.cancel();
      this._exitAnimation = null;
    }
  }

  private _attachDocListeners(): void {
    if (this._docListenersActive) return;
    document.addEventListener('mousedown', this._boundOutsideClick, true);
    document.addEventListener('keydown', this._boundKeyDown);
    this._docListenersActive = true;
  }

  private _detachDocListeners(): void {
    if (!this._docListenersActive) return;
    document.removeEventListener('mousedown', this._boundOutsideClick, true);
    document.removeEventListener('keydown', this._boundKeyDown);
    this._docListenersActive = false;
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (!changed.has('_open')) return;

    if (this._open && !this._animatedIn) {
      this._animatedIn = true;
      requestAnimationFrame(() => {
        if (this._enterAnimation) {
          this._enterAnimation.cancel();
          this._enterAnimation = null;
        }
        const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
        if (panel) {
          this._panelEl = panel;
          const anim = panel.animate(
            [
              { opacity: 0, transform: 'scale(0.97)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: prefersReducedMotion() ? 0 : 120, easing: 'cubic-bezier(0.2, 0, 0, 1)', fill: 'forwards' },
          );
          anim.finished.then(
            () => {
              anim.commitStyles();
              anim.cancel();
            },
            (_e: unknown) => {
              /* cancelled - no-op */
            },
          );
          this._enterAnimation = anim;
        }
      });
    } else if (!this._open) {
      this._animatedIn = false;
      this._panelEl = null;
    }
  }

  private _flattenOptions(): readonly FlatOption[] {
    if (this.options === this._flatCacheKey) return this._flatCache;
    const result: FlatOption[] = [];
    for (const opt of this.options) {
      if (isOptionGroup(opt)) {
        for (const o of opt.options) {
          result.push({ value: o.value, label: o.label, disabled: o.disabled ?? false, groupLabel: opt.group });
        }
      } else {
        result.push({ value: opt.value, label: opt.label, disabled: opt.disabled ?? false });
      }
    }
    this._flatCacheKey = this.options;
    this._flatCache = result;
    return result;
  }

  private _getSelectedLabel(): string {
    const flat = this._flattenOptions();
    const match = flat.find((o) => o.value === this.value);
    return match?.label ?? '';
  }

  private _openDropdown(): void {
    if (this.disabled || this.loading) return;
    if (this._exitAnimation !== null) {
      this._exitAnimation.cancel();
      this._exitAnimation = null;
    }
    this._attachDocListeners();
    this._open = true;
    const flat = this._flattenOptions();
    const selectedIdx = flat.findIndex((o) => o.value === this.value);
    this._highlightedIndex = selectedIdx >= 0 ? selectedIdx : this._findFirstEnabled(flat, 0);
    this._scrollToHighlighted();
  }

  private _closeDropdown(): void {
    if (!this._open || this._exitAnimation !== null) return;

    const panel = this._panelEl ?? this.querySelector<HTMLElement>(`#${this._panelId}`);
    if (panel) {
      const anim = panel.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.97)' },
        ],
        { duration: prefersReducedMotion() ? 0 : 80, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
      );
      this._exitAnimation = anim;
      const onFinish = (): void => {
        this._exitAnimation = null;
        this._open = false;
        this._highlightedIndex = -1;
        this._clearTypeAhead();
        this._detachDocListeners();
      };
      anim.finished.then(() => {
        anim.commitStyles();
        anim.cancel();
        onFinish();
      }, onFinish);
    } else {
      this._open = false;
      this._highlightedIndex = -1;
      this._clearTypeAhead();
      this._detachDocListeners();
    }
  }

  private _toggleDropdown(): void {
    if (this._open) {
      this._closeDropdown();
    } else {
      this._openDropdown();
    }
  }

  private _selectOption(value: string): void {
    this.value = value as V;
    this._closeDropdown();
    this.emit('kb-change', { source: 'select', value });
    this._focusTrigger();
  }

  private _handleClear(): void {
    this.value = '';
    this.emit('kb-change', { source: 'select', value: '' });
    this.emit('kb-clear');
    this._focusTrigger();
  }

  private _handleClearClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this._handleClear();
  }

  private _handleTriggerFocus(): void {
    this._focused = true;
    this.emit('kb-focus');
  }

  private _handleTriggerBlur(e: FocusEvent): void {
    const related = e.relatedTarget as Node | null;
    if (related && this.contains(related)) return;
    this._focused = false;
    if (this._open) this._closeDropdown();
    this.emit('kb-blur');
  }

  private _focusTrigger(): void {
    const trigger = this.renderRoot.querySelector<HTMLElement>('[role="combobox"]');
    trigger?.focus();
  }

  private _handleOutsideClick(e: MouseEvent): void {
    if (!this._open) return;
    if (!this.contains(e.target as Node)) {
      this._closeDropdown();
    }
  }

  private _handleGlobalKeyDown(e: KeyboardEvent): void {
    if (!(this._open && this._focused)) return;
    this._dispatchOpenKeyDown(e);
  }

  private _handleTriggerKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (this._open) {
      this._dispatchOpenKeyDown(e);
      return;
    }
    this._dispatchClosedKeyDown(e);
  }

  private _dispatchClosedKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this._openDropdown();
    }
  }

  private _dispatchOpenKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._closeDropdown();
        this._focusTrigger();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._moveHighlight(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._moveHighlight(-1);
        break;
      case 'Home':
        e.preventDefault();
        this._moveHighlightToEdge(1);
        break;
      case 'End':
        e.preventDefault();
        this._moveHighlightToEdge(-1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this._selectHighlighted();
        break;
      case 'Tab':
        this._closeDropdown();
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this._handleTypeAhead(e.key);
        }
        break;
    }
  }

  private _moveHighlight(direction: 1 | -1): void {
    const flat = this._flattenOptions();
    if (flat.length === 0) return;
    const next = this._findNextEnabled(flat, this._highlightedIndex, direction);
    if (next >= 0) {
      this._highlightedIndex = next;
      this._scrollToHighlighted();
    }
  }

  private _moveHighlightToEdge(direction: 1 | -1): void {
    const flat = this._flattenOptions();
    if (flat.length === 0) return;
    const startIdx = direction === 1 ? 0 : flat.length - 1;
    const found = this._findFirstEnabled(flat, startIdx, direction);
    if (found >= 0) {
      this._highlightedIndex = found;
      this._scrollToHighlighted();
    }
  }

  private _selectHighlighted(): void {
    const flat = this._flattenOptions();
    const opt = flat[this._highlightedIndex];
    if (opt && !opt.disabled) {
      this._selectOption(opt.value);
    }
  }

  private _findNextEnabled(flat: readonly FlatOption[], fromIndex: number, direction: 1 | -1): number {
    const len = flat.length;
    let idx = fromIndex + direction;
    while (idx >= 0 && idx < len) {
      if (!flat[idx]?.disabled) return idx;
      idx += direction;
    }
    return -1;
  }

  private _findFirstEnabled(flat: readonly FlatOption[], startIdx: number, direction: 1 | -1 = 1): number {
    const len = flat.length;
    let idx = startIdx;
    while (idx >= 0 && idx < len) {
      if (!flat[idx]?.disabled) return idx;
      idx += direction;
    }
    return -1;
  }

  private _handleTypeAhead(char: string): void {
    this._typeAheadBuffer += char.toLowerCase();
    this._resetTypeAheadTimer();
    const flat = this._flattenOptions();
    const query = this._typeAheadBuffer;
    const matchIdx = flat.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(query));
    if (matchIdx >= 0) {
      this._highlightedIndex = matchIdx;
      this._scrollToHighlighted();
    }
  }

  private _resetTypeAheadTimer(): void {
    if (this._typeAheadTimer !== null) clearTimeout(this._typeAheadTimer);
    this._typeAheadTimer = setTimeout(() => {
      this._typeAheadBuffer = '';
      this._typeAheadTimer = null;
    }, TYPE_AHEAD_TIMEOUT_MS);
  }

  private _clearTypeAhead(): void {
    if (this._typeAheadTimer !== null) {
      clearTimeout(this._typeAheadTimer);
      this._typeAheadTimer = null;
    }
    this._typeAheadBuffer = '';
  }

  private _scrollToHighlighted(): void {
    if (this._highlightedIndex < 0) return;
    if (this._rafScroll !== null) return;
    this._rafScroll = requestAnimationFrame(() => {
      this._rafScroll = null;
      const optionId = `${OPTION_ID_PREFIX}${this._instanceId}-${this._highlightedIndex}`;
      const el = this.renderRoot.querySelector(`#${optionId}`);
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  private _handlePanelClick(e: Event): void {
    const target = (e.target as Element).closest<HTMLElement>('[role="option"]');
    if (!target) return;
    if (target.getAttribute('aria-disabled') === 'true') return;
    const value = target.dataset.value;
    if (value !== undefined) this._selectOption(value);
  }

  private _rafMouseMove: ReturnType<typeof requestAnimationFrame> | null = null;
  private _rafScroll: ReturnType<typeof requestAnimationFrame> | null = null;

  private _handlePanelMouseMove(e: Event): void {
    if (this._rafMouseMove !== null) return;
    this._rafMouseMove = requestAnimationFrame(() => {
      this._rafMouseMove = null;
      const target = (e.target as Element).closest<HTMLElement>('[role="option"]');
      if (!target) return;
      if (target.getAttribute('aria-disabled') === 'true') return;
      const idx = Number(target.dataset.index);
      if (!Number.isNaN(idx) && idx !== this._highlightedIndex) this._highlightedIndex = idx;
    });
  }

  private _computeTriggerClasses(): string {
    const hasValue = this.value !== '';
    return cx(
      'flex-1 min-w-0 text-left truncate select-none',
      SIZE_TEXT[this.size],
      hasValue ? kbClasses.textPrimary : 'text-slate-400 dark:text-zinc-500',
      this.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    );
  }

  private _computeOptionClasses(index: number, disabled: boolean, isSelected: boolean): string {
    const highlighted = index === this._highlightedIndex;
    return cx(
      'flex items-center justify-between cursor-pointer select-none',
      SIZE_PADDING[this.size],
      SIZE_TEXT[this.size],
      disabled && 'opacity-40 cursor-not-allowed',
      !disabled && isSelected && highlighted && 'bg-blue-500 text-white',
      !disabled && isSelected && !highlighted && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      !(disabled || isSelected) && highlighted && `${kbClasses.surfaceMuted} ${kbClasses.textPrimary}`,
      !(disabled || isSelected || highlighted) && kbClasses.textPrimary,
      kbClasses.transitionColors,
    );
  }

  private _optionId(index: number): string {
    return `${OPTION_ID_PREFIX}${this._instanceId}-${index}`;
  }

  private get _activeDescendant(): string {
    return this._highlightedIndex >= 0 ? this._optionId(this._highlightedIndex) : '';
  }

  private _renderIconSlot(): TemplateResult | typeof nothing {
    const iconSlot = this.slotted('icon');
    if (!iconSlot) return nothing;
    const iconClasses = cx('shrink-0 flex items-center select-none', kbClasses.textMuted, SIZE_ICON[this.size]);
    return html`<span class="${iconClasses}">${iconSlot}</span>`;
  }

  private _renderChevron(): TemplateResult | typeof nothing {
    if (this.loading && !this.disabled) return nothing;
    const chevronRotate = this._open ? 'rotate-180' : 'rotate-0';
    return html`<span class="shrink-0 flex items-center pointer-events-none select-none ${kbClasses.textMuted} transition-transform duration-200 ease-in-out ${chevronRotate}">
      <svg class="${CLEAR_SIZE[this.size]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>
    </span>`;
  }

  private _renderClearButton(): TemplateResult | typeof nothing {
    if (!(this.clearable && this.value !== '' && !this.disabled)) return nothing;
    return html`<button
      class="${FORM_CLEAR_CLASSES}"
      @click=${this._handleClearClick}
      type="button"
      aria-label="Clear selection"
      tabindex="-1"
    >${this._cachedCloseIcon}</button>`;
  }

  private _renderLoadingSpinner(): TemplateResult | typeof nothing {
    if (!this.loading || this.disabled) return nothing;
    return renderFormSpinner(SPINNER_SIZE[this.size]);
  }

  private _renderHiddenInput(): TemplateResult | typeof nothing {
    if (!this.name) return nothing;
    return html`<input type="hidden" name=${this.name} .value=${this.value} />`;
  }

  private _renderGroupHeader(label: string): TemplateResult {
    return html`<div role="presentation" class="${cx(kbClasses.label, 'px-3 py-1.5 select-none')}">${label}</div>`;
  }

  private _renderOption(opt: FlatOption, index: number): TemplateResult {
    const isSelected = opt.value === this.value;
    const classes = this._computeOptionClasses(index, opt.disabled, isSelected);
    return html`<div
      id=${this._optionId(index)}
      role="option"
      class=${classes}
      aria-selected=${isSelected ? 'true' : 'false'}
      aria-disabled=${opt.disabled ? 'true' : 'false'}
      data-value=${opt.value}
      data-index=${index}
    ><span class="truncate">${opt.label}</span>${isSelected ? this._renderCheckIcon() : nothing}</div>`;
  }

  private _renderCheckIcon(): TemplateResult {
    return html`<svg class="${CLEAR_SIZE[this.size]} shrink-0 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`;
  }

  private _onPanelMouseDown = (e: Event): void => {
    e.preventDefault();
  };

  private _renderPanelOptions(): unknown {
    const flat = this._flattenOptions();
    let lastGroup: string | undefined;

    // Build a synthetic array that interleaves group headers and separator dividers.
    // Then use repeat() so Lit can DOM-recycle options by stable key.
    const rows: Array<{ key: string; tpl: TemplateResult }> = [];

    for (let i = 0; i < flat.length; i++) {
      const opt = flat[i];
      if (!opt) continue;
      if (opt.groupLabel !== undefined && opt.groupLabel !== lastGroup) {
        if (rows.length > 0) {
          rows.push({
            key: `__sep__${opt.groupLabel}`,
            tpl: html`<div role="presentation" class="border-t ${kbClasses.borderColor}"></div>`,
          });
        }
        rows.push({ key: `__grp__${opt.groupLabel}`, tpl: this._renderGroupHeader(opt.groupLabel) });
        lastGroup = opt.groupLabel;
      }
      rows.push({ key: opt.value, tpl: this._renderOption(opt, i) });
    }

    return repeat(
      rows,
      (r) => r.key,
      (r) => r.tpl,
    );
  }

  private _renderPanel(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const panelClasses = cx(
      'absolute z-50 left-0 right-0 top-full mt-1',
      'max-h-60 overflow-y-auto',
      kbClasses.surface,
      kbClasses.border,
      'py-1',
    );
    const flat = this._flattenOptions();
    const isEmpty = flat.length === 0;
    return html`<div
      id=${this._panelId}
      role="listbox"
      aria-label=${this.placeholder ?? 'Options'}
      class=${panelClasses}
      @mousedown=${this._onPanelMouseDown}
      @click=${this._handlePanelClick}
      @mousemove=${this._handlePanelMouseMove}
    >${
      isEmpty
        ? html`<div role="status" class=${cx(SIZE_PADDING[this.size], SIZE_TEXT[this.size], kbClasses.textMuted, 'select-none')}>${this.emptyText}</div>`
        : this._renderPanelOptions()
    }</div>`;
  }

  private _renderTriggerText(): TemplateResult {
    const label = this._getSelectedLabel();
    const text = label || this.placeholder || '';
    return html`<span class=${this._computeTriggerClasses()}>${text}</span>`;
  }

  override render(): TemplateResult {
    const isFlushed = this.variant === 'flushed';
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];

    const outerClasses = this.buildClasses(
      'relative flex items-stretch w-full font-sans',
      kbClasses.transitionColors,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const innerClasses = cx(
      'flex items-center flex-1',
      SIZE_PADDING[this.size],
      SIZE_GAP[this.size],
      isFlushed ? wrapperBorder : '',
      isFlushed && this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    return html`
      <div class=${outerClasses}>
        <div
          class=${innerClasses}
          role="combobox"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-haspopup="listbox"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-activedescendant=${this._activeDescendant}
          aria-controls=${this._open ? this._panelId : nothing}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-required=${this.required ? 'true' : 'false'}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this._toggleDropdown}
          @keydown=${this._handleTriggerKeyDown}
          @focus=${this._handleTriggerFocus}
          @blur=${this._handleTriggerBlur}
        >
          ${this._renderIconSlot()}
          ${this._renderTriggerText()}
          ${this._renderClearButton()}
          ${this._renderLoadingSpinner()}
          ${this._renderChevron()}
        </div>
        ${this._renderPanel()}
        ${this._renderHiddenInput()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-select': KbSelect;
  }
}
