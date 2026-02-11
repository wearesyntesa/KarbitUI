import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { KbFormLabel } from './kb-form-label.js';

type FormChild = HTMLElement & { invalid?: boolean; disabled?: boolean; required?: boolean };

const FORM_CHILD_TAGS = ['KB-INPUT', 'KB-TEXTAREA', 'KB-SELECT'] as const;

/**
 * Form field wrapper providing context propagation, helper/error text,
 * and counter display for child form inputs.
 *
 * @slot - Form input and label content.
 * @slot helper - Muted helper text below the input (hidden when `invalid` with error slot).
 * @slot error - Red error text below the input (shown only when `invalid`).
 * @slot counter - Right-aligned text below the input (e.g. character count "12/100").
 *
 * @example
 * ```html
 * <kb-form-control required invalid>
 *   <kb-form-label>Email</kb-form-label>
 *   <kb-input placeholder="you@example.com"></kb-input>
 *   <span slot="helper">We'll never share your email.</span>
 *   <span slot="error">Please enter a valid email address.</span>
 *   <span slot="counter">0/100</span>
 * </kb-form-control>
 * ```
 */
@customElement('kb-form-control')
export class KbFormControl extends KbBaseElement<'helper' | 'error' | 'counter'> {
  static override hostDisplay = 'block' as const;

  /** Mark the field as required. Propagated to child input and label. @defaultValue false */
  @property({ type: Boolean, reflect: true }) required: boolean = false;
  /** Mark the field as invalid. Propagated to child input; switches helper → error text. @defaultValue false */
  @property({ type: Boolean, reflect: true }) invalid: boolean = false;
  /** Disable the field. Propagated to child input. @defaultValue false */
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  override firstUpdated(): void {
    this._propagateContext();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('required') || changed.has('invalid') || changed.has('disabled')) {
      this._propagateContext();
    }
  }

  private _propagateContext(): void {
    const label = this.querySelector('kb-form-label') as KbFormLabel | null;
    if (label && this.required && !label.hasAttribute('required')) label.required = true;

    for (const tag of FORM_CHILD_TAGS) {
      const child = this.querySelector(tag) as FormChild | null;
      if (!child) continue;
      if (this.invalid && !child.hasAttribute('invalid')) child.invalid = true;
      if (this.disabled && !child.hasAttribute('disabled')) child.disabled = true;
      if (this.required && !child.hasAttribute('required')) child.required = true;
    }
  }

  override render(): TemplateResult {
    const helperEl = this.slotted('helper');
    const errorEl = this.slotted('error');
    const counterEl = this.slotted('counter');

    const showError = this.invalid && errorEl;
    const showHelper = !showError && helperEl;
    const showBottom = showError || showHelper || counterEl;

    let feedbackEl = nothing as typeof nothing | ReturnType<typeof html>;
    if (showError) {
      feedbackEl = html`<span class="text-xs text-red-500 dark:text-red-400 animate-kb-fade-in">${errorEl}</span>`;
    } else if (showHelper) {
      feedbackEl = html`<span class="text-xs ${kbClasses.textMuted}">${helperEl}</span>`;
    }

    const classes = this.buildClasses('flex flex-col gap-1.5 font-sans');

    const bottomRow = showBottom
      ? html`<div class="flex items-start justify-between gap-4 min-h-[1.25rem]">
          <span class="flex-1">
            ${feedbackEl}
          </span>
          ${
            counterEl
              ? html`<span class="text-xs ${kbClasses.textMuted} shrink-0 tabular-nums">${counterEl}</span>`
              : nothing
          }
        </div>`
      : nothing;

    return html`
      <div class=${classes} role="group">
        ${this.defaultSlotContent}
        ${bottomRow}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-form-control': KbFormControl;
  }
}
