import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';

const SIZE_MAP: Record<ComponentSize, string> = {
  xs: 'text-[9px]',
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-xs',
  xl: 'text-sm',
} as const satisfies Record<ComponentSize, string>;

/**
 * Label for form controls with required indicator, optional text, and info slot.
 *
 * @slot - Label text content.
 * @slot info - Inline help icon or text rendered after the label.
 *
 * @example
 * ```html
 * <kb-form-label required>
 *   Email Address
 *   <span slot="info"><svg>...</svg></span>
 * </kb-form-label>
 * ```
 */
@customElement('kb-form-label')
export class KbFormLabel extends KbBaseElement<'info'> {
  /** `for` attribute linking the label to a form element by ID. */
  @property({ type: String }) for?: string;
  /** Label size controlling font size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Show a red asterisk after the label text. @defaultValue false */
  @property({ type: Boolean }) required: boolean = false;
  /** Show "(optional)" after the label text. Hidden when `required` is true. @defaultValue false */
  @property({ type: Boolean }) optional: boolean = false;

  override render(): TemplateResult {
    const sizeClass = SIZE_MAP[this.size];
    const infoEl = this.slotted('info');

    const classes = this.buildClasses(
      'inline-flex items-center gap-1.5 font-mono uppercase tracking-widest',
      sizeClass,
      kbClasses.textSecondary,
    );

    const requiredMark = this.required
      ? html`<span class="text-red-500 dark:text-red-400" aria-hidden="true">*</span>`
      : nothing;

    const optionalMark =
      !this.required && this.optional
        ? html`<span class="text-slate-400 dark:text-zinc-500 normal-case tracking-normal font-sans font-normal">(optional)</span>`
        : nothing;

    const infoSlot = infoEl
      ? html`<span class="inline-flex items-center text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 ${kbClasses.transition} [&>svg]:w-3.5 [&>svg]:h-3.5 cursor-help">${infoEl}</span>`
      : nothing;

    return html`
      <label class=${classes} for=${this.for ?? ''}>
        ${this.defaultSlotContent}${requiredMark}${optionalMark}${infoSlot}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-form-label': KbFormLabel;
  }
}
