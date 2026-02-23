import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { KbFormLabel } from './kb-form-label.js';

type FormChild = HTMLElement & { invalid?: boolean; disabled?: boolean; required?: boolean };

const FORM_CHILD_TAGS = ['KB-INPUT', 'KB-TEXTAREA', 'KB-SELECT', 'KB-CHECKBOX', 'KB-RADIO', 'KB-SWITCH'] as const;

let _fcCounter = 0;

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

  private readonly _feedbackId: string = `kb-fc-fb-${++_fcCounter}`;
  private readonly _labelId: string = `kb-fc-lbl-${++_fcCounter}`;
  private _labelEl: KbFormLabel | null = null;
  private _childEl: FormChild | null = null;
  private _childObserver: MutationObserver | undefined;

  private _refreshCache(): void {
    this._labelEl = this.querySelector('kb-form-label') as KbFormLabel | null;
    this._childEl = null;
    for (const tag of FORM_CHILD_TAGS) {
      const el = this.querySelector(tag) as FormChild | null;
      if (el) {
        this._childEl = el;
        break;
      }
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._refreshCache();
    this._childObserver = new MutationObserver(() => {
      this._refreshCache();
      this._propagateContext();
      this._linkAriaDescribedBy();
    });
    this._childObserver.observe(this, { childList: true });
  }

  override disconnectedCallback(): void {
    this._childObserver?.disconnect();
    this._childObserver = undefined;
    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this._propagateContext();
    this._linkAriaDescribedBy();
  }

  override updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('required') || changed.has('invalid') || changed.has('disabled')) {
      this._propagateContext();
    }
    if (changed.has('invalid')) {
      this._linkAriaDescribedBy();
    }
  }

  private _propagateContext(): void {
    const label = this._labelEl;
    if (label) {
      if (this.required && !label.hasAttribute('required')) label.required = true;
      if (!label.id) label.id = this._labelId;
    }

    const child = this._childEl;
    if (child) this._applyContextToChild(child);
  }

  private _applyContextToChild(child: FormChild): void {
    if (this.invalid && !child.hasAttribute('invalid')) child.invalid = true;
    if (!this.invalid && child.invalid) child.invalid = false;
    if (this.disabled && !child.hasAttribute('disabled')) child.disabled = true;
    if (this.required && !child.hasAttribute('required')) child.required = true;
  }

  private _linkAriaDescribedBy(): void {
    const child = this._childEl as HTMLElement | null;
    if (!child) return;
    const existing = child.getAttribute('aria-describedby') ?? '';
    const id = this._feedbackId;
    if (!existing.includes(id)) {
      child.setAttribute('aria-describedby', existing ? `${existing} ${id}` : id);
    }
  }

  private _renderFeedback(
    errorEl: Element | null,
    helperEl: Element | null,
    counterEl: Element | null,
  ): ReturnType<typeof html> | typeof nothing {
    const showError = this.invalid && !!errorEl;
    const showHelper = !showError && !!helperEl;
    const showBottom = showError || showHelper || !!counterEl;

    // In Light DOM, slotted elements remain as direct host children and are
    // always visible unless explicitly hidden. Hide whichever feedback node is
    // not currently active so it doesn't render as bare text outside the layout.
    // The active node gets moved into the render tree (display reset to '').
    if (helperEl instanceof HTMLElement) helperEl.style.display = showHelper ? '' : 'none';
    if (errorEl instanceof HTMLElement) errorEl.style.display = showError ? '' : 'none';

    if (!showBottom) return nothing;

    let feedbackEl: ReturnType<typeof html> | typeof nothing = nothing;
    if (showError && errorEl) {
      feedbackEl = html`<span class="text-xs text-red-500 dark:text-red-400 animate-kb-fade-in select-none">${errorEl}</span>`;
    } else if (showHelper && helperEl) {
      feedbackEl = html`<span class="text-xs ${kbClasses.textMuted} select-none">${helperEl}</span>`;
    }

    return html`<div class="flex items-start justify-between gap-4 min-h-[1.25rem]">
      <span id=${this._feedbackId} class="flex-1" aria-live="polite">
        ${feedbackEl}
      </span>
      ${counterEl ? html`<span class="text-xs ${kbClasses.textMuted} shrink-0 tabular-nums select-none">${counterEl}</span>` : nothing}
    </div>`;
  }

  override render(): TemplateResult {
    const classes = this.buildClasses('flex flex-col gap-1.5 font-sans');
    return html`
      <div class=${classes} role="group" aria-labelledby=${this._labelId}>
        ${this.defaultSlotContent}
        ${this._renderFeedback(this.slotted('error'), this.slotted('helper'), this.slotted('counter'))}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-form-control': KbFormControl;
  }
}
