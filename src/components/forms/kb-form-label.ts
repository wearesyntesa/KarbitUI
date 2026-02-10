import { html, nothing } from 'lit';
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
};

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
export class KbFormLabel extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
  }

  @property({ type: String }) for?: string;
  @property({ type: String }) size: ComponentSize = 'md';
  @property({ type: Boolean }) required: boolean = false;
  @property({ type: Boolean }) optional: boolean = false;

  override render() {
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

    const optionalMark = !this.required && this.optional
      ? html`<span class="text-slate-400 dark:text-zinc-500 normal-case tracking-normal font-sans font-normal">(optional)</span>`
      : nothing;

    const infoSlot = infoEl
      ? html`<span class="inline-flex items-center text-slate-400 dark:text-zinc-500 [&>svg]:w-3.5 [&>svg]:h-3.5 cursor-help">${infoEl}</span>`
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
