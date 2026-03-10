import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import {
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
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';
import { arrayHasChanged } from '../../utils/has-changed.js';
import type { TagSize } from '../data-display/kb-tag.js';
import '../data-display/kb-tag.define.js';

const TAG_SIZE_MAP: Record<ComponentSize, TagSize> = {
  xs: 'sm',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
} as const satisfies Record<ComponentSize, TagSize>;

/**
 * Multi-value text input with tag chips. Type and press Enter to add tags.
 *
 * Renders each value as a `kb-tag` component with closable dismiss.
 *
 * @fires kb-change - Fires on any value change. Detail: `{ source: 'tags-input', values: string[] }`.
 * @fires kb-tag-add - Fires when a tag is added. Detail: `{ value: string }`.
 * @fires kb-tag-remove - Fires when a tag is removed. Detail: `{ value: string, index: number }`.
 *
 * @example
 * ```html
 * <kb-tags-input placeholder="Add tag..." .values=${['react', 'lit']}></kb-tags-input>
 * ```
 */
export class KbTagsInput extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Current tag values. */
  @property({ type: Array, hasChanged: arrayHasChanged }) values: readonly string[] = [];
  /** Placeholder text for the input. */
  @property({ type: String }) placeholder?: string;
  /** Visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Display size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Maximum number of tags allowed. 0 = unlimited. @defaultValue 0 */
  @property({ type: Number }) max: number = 0;
  /** Allow duplicate tag values. @defaultValue false */
  @property({ type: Boolean, attribute: 'allow-duplicates' }) allowDuplicates: boolean = false;
  /** Form field name. */
  @property({ type: String }) name?: string;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!isServer) {
      // Ensure the host respects parent container width when used inside
      // flex/grid layouts (prevents tags from overflowing instead of wrapping).
      this.style.minWidth = '0';
      this.style.maxWidth = '100%';
    }
  }

  private _addTag(value: string): void {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!this.allowDuplicates && this.values.includes(trimmed)) return;
    if (this.max > 0 && this.values.length >= this.max) return;

    const newValues = [...this.values, trimmed];
    this.values = newValues;
    this.emit('kb-tag-add', { value: trimmed });
    this.emit('kb-change', { source: 'tags-input', values: newValues });
  }

  private _removeTag(index: number): void {
    const removed = this.values[index];
    if (removed === undefined) return;
    const newValues = this.values.filter((_, i) => i !== index);
    this.values = newValues;
    this.emit('kb-tag-remove', { value: removed, index });
    this.emit('kb-change', { source: 'tags-input', values: newValues });
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLInputElement;

    if (e.key === 'Enter') {
      e.preventDefault();
      this._addTag(target.value);
      target.value = '';
      return;
    }

    if (e.key === 'Backspace' && target.value === '' && this.values.length > 0) {
      this._removeTag(this.values.length - 1);
    }
  }

  private _handlePaste(e: ClipboardEvent): void {
    const text = e.clipboardData?.getData('text') ?? '';
    if (!(text.includes(',') || text.includes('\n'))) return;

    e.preventDefault();
    const parts = text
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    let changed = false;
    const newValues = [...this.values];

    for (const part of parts) {
      if (this.max > 0 && newValues.length >= this.max) break;
      if (!this.allowDuplicates && newValues.includes(part)) continue;
      newValues.push(part);
      this.emit('kb-tag-add', { value: part });
      changed = true;
    }

    if (changed) {
      this.values = newValues;
      this.emit('kb-change', { source: 'tags-input', values: newValues });
    }
    const input = e.target as HTMLInputElement;
    input.value = '';
  }

  private _renderTag(value: string, index: number): TemplateResult {
    const tagSize = TAG_SIZE_MAP[this.size];
    return html`
      <kb-tag
        size=${tagSize}
        variant="subtle"
        ?closable=${!this.disabled}
        @kb-close=${(): void => this._removeTag(index)}
      >${value}</kb-tag>
    `;
  }

  override render(): TemplateResult {
    const s = this.size;
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];

    const outerClasses = this.buildClasses(
      'flex flex-wrap items-center w-full font-sans',
      SIZE_PADDING[s],
      SIZE_GAP[s],
      wrapperBorder,
      kbClasses.transitionColors,
      this.disabled ? kbClasses.disabled : '',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const inputClasses = cx(FORM_INPUT_BASE, FORM_PLACEHOLDER, SIZE_TEXT[s], kbClasses.textPrimary);

    return html`
      <div class=${outerClasses}>
        ${this.values.map((v, i) => this._renderTag(v, i))}
        <input
          class=${inputClasses}
          style="min-width:60px"
          type="text"
          placeholder=${this.values.length === 0 ? (this.placeholder ?? '') : ''}
          ?disabled=${this.disabled}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          @keydown=${this._handleKeyDown}
          @paste=${this._handlePaste}
        />
      </div>
      ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.values.join(',')} />` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-tags-input': KbTagsInput;
  }
}
