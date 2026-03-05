import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const satisfies Record<ComponentSize, string>;

const ICON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-[1.125rem] h-[1.125rem]',
} as const satisfies Record<ComponentSize, string>;

const INPUT_PADDING: Record<ComponentSize, string> = {
  xs: 'px-0.5 py-0',
  sm: 'px-1 py-px',
  md: 'px-1 py-0.5',
  lg: 'px-1.5 py-0.5',
  xl: 'px-2 py-1',
} as const satisfies Record<ComponentSize, string>;

const GAP: Record<ComponentSize, string> = {
  xs: 'gap-0.5',
  sm: 'gap-1',
  md: 'gap-1',
  lg: 'gap-1.5',
  xl: 'gap-1.5',
} as const satisfies Record<ComponentSize, string>;

/**
 * Inline editable text component. Click text to edit it in-place.
 * Renders as inline text that reveals editability on hover.
 *
 * @fires kb-change - Fires when the value changes. Detail: `{ source: 'editable', value: string }`.
 * @fires kb-edit-submit - Fires when editing is confirmed. Detail: `{ value: string, previousValue: string }`.
 * @fires kb-edit-cancel - Fires when editing is cancelled. Detail: `{ value: string }`.
 *
 * @example
 * ```html
 * <kb-editable value="Hello world"></kb-editable>
 * ```
 */
export class KbEditable extends KbBaseElement {
  static override hostDisplay = 'inline-flex' as const;

  /** Current text value. */
  @property({ type: String }) value: string = '';
  /** Placeholder shown when value is empty. @defaultValue 'Click to edit' */
  @property({ type: String }) placeholder: string = 'Click to edit';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Mark as invalid — shows red underline. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Start in edit mode. @defaultValue false */
  @property({ type: Boolean, attribute: 'start-with-edit-view' }) startWithEditView: boolean = false;
  /** Activation trigger. @defaultValue 'click' */
  @property({ type: String }) activation: 'click' | 'dblclick' = 'click';
  /** Display size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Auto-submit when input loses focus. @defaultValue true */
  @property({ type: Boolean, attribute: 'submit-on-blur' }) submitOnBlur: boolean = true;
  /** Form field name. */
  @property({ type: String }) name?: string;

  @state() private _editing: boolean = false;
  @state() private _editValue: string = '';

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.startWithEditView && !this.disabled) {
      this._enterEditMode();
    }
  }

  private _enterEditMode(): void {
    if (this.disabled) return;
    this._editing = true;
    this._editValue = this.value;
    this.updateComplete.then((): void => {
      const input = this.querySelector<HTMLInputElement>('input[data-kb-edit-input]');
      if (input) {
        input.focus();
        input.select();
      }
    });
  }

  private _handleConfirm(): void {
    const previousValue = this.value;
    const newValue = this._editValue;
    this._editing = false;
    if (newValue !== previousValue) {
      this.value = newValue;
      this.emit('kb-change', { source: 'editable', value: newValue });
    }
    this.emit('kb-edit-submit', { value: newValue, previousValue });
  }

  private _handleCancel(): void {
    this._editing = false;
    this._editValue = this.value;
    this.emit('kb-edit-cancel', { value: this.value });
  }

  private _handleInputKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._handleConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this._handleCancel();
    }
  }

  private _handleInputChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this._editValue = target.value;
  }

  private _handleBlur(e: FocusEvent): void {
    if (!this.submitOnBlur) return;
    const related = e.relatedTarget as Node | null;
    if (related && this.contains(related)) return;
    this._handleConfirm();
  }

  private _handleActivation(e: Event): void {
    if (this.disabled) return;
    const eventType = e.type;
    if (this.activation === 'click' && eventType === 'click') {
      this._enterEditMode();
    } else if (this.activation === 'dblclick' && eventType === 'dblclick') {
      this._enterEditMode();
    }
  }

  private _handleDisplayKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._enterEditMode();
    }
  }

  private _preventMouseDown(e: Event): void {
    e.preventDefault();
  }

  private _renderDisplay(): TemplateResult {
    const s = this.size;
    const isEmpty = !this.value;
    const displayText = isEmpty ? this.placeholder : this.value;
    const iconSize = ICON_SIZE[s];

    const underlineColor = this.invalid
      ? 'decoration-red-500 dark:decoration-red-400'
      : 'decoration-gray-400 dark:decoration-zinc-500';

    const wrapperClasses = cx(
      'inline-flex items-center font-sans',
      SIZE_TEXT[s],
      GAP[s],
      kbClasses.transitionColors,
      this.disabled
        ? kbClasses.disabledLook
        : cx(
            'cursor-pointer underline decoration-dashed underline-offset-4 decoration-transparent',
            `hover:${underlineColor}`,
          ),
    );

    const textClasses = isEmpty ? 'text-slate-400 dark:text-zinc-500 italic' : kbClasses.textPrimary;

    return html`
      <span
        class=${wrapperClasses}
        @click=${(e: Event): void => this._handleActivation(e)}
        @dblclick=${(e: Event): void => this._handleActivation(e)}
        role="button"
        tabindex=${this.disabled ? '-1' : '0'}
        aria-label=${isEmpty ? this.placeholder : `Edit: ${this.value}`}
        @keydown=${(e: KeyboardEvent): void => this._handleDisplayKeyDown(e)}
      >
        <span class=${textClasses}>${displayText}</span>
        ${
          this.disabled
            ? nothing
            : html`<svg
              class=${cx(iconSize, 'shrink-0 opacity-0 group-hover/edit:opacity-40 transition-opacity', kbClasses.textMuted)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>`
        }
      </span>
    `;
  }

  private _renderEdit(): TemplateResult {
    const s = this.size;
    const iconSize = ICON_SIZE[s];

    const borderColor = this.invalid
      ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400'
      : 'border-gray-300 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-400';

    const inputClasses = cx(
      'bg-transparent outline-none font-sans border-b',
      SIZE_TEXT[s],
      INPUT_PADDING[s],
      borderColor,
      kbClasses.textPrimary,
      'placeholder:text-slate-400 dark:placeholder:text-zinc-500',
      kbClasses.transitionColors,
    );

    const btnClasses = cx(
      'shrink-0 inline-flex items-center justify-center',
      'cursor-pointer bg-transparent border-none p-0',
      kbClasses.textMuted,
      kbClasses.transitionColors,
    );

    return html`
      <span class=${cx('inline-flex items-center font-sans', SIZE_TEXT[s], GAP[s])}>
        <input
          type="text"
          data-kb-edit-input
          .value=${this._editValue}
          class=${inputClasses}
          placeholder=${this.placeholder}
          @input=${this._handleInputChange}
          @keydown=${this._handleInputKeyDown}
          @blur=${(e: FocusEvent): void => this._handleBlur(e)}
          aria-label="Edit value"
        />
        <button
          type="button"
          class=${cx(btnClasses, 'hover:text-green-600 dark:hover:text-green-400')}
          @click=${(): void => this._handleConfirm()}
          @mousedown=${(e: Event): void => this._preventMouseDown(e)}
          aria-label="Confirm"
        >
          <svg class=${iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </button>
        <button
          type="button"
          class=${cx(btnClasses, 'hover:text-red-500 dark:hover:text-red-400')}
          @click=${(): void => this._handleCancel()}
          @mousedown=${(e: Event): void => this._preventMouseDown(e)}
          aria-label="Cancel"
        >
          <svg class=${iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </span>
    `;
  }

  override render(): TemplateResult {
    const hiddenInput = this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : nothing;

    return html`<span class="group/edit">${this._editing ? this._renderEdit() : this._renderDisplay()}</span>${hiddenInput}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-editable': KbEditable;
  }
}
