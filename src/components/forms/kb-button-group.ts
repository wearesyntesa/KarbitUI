import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';

export type ButtonGroupDirection = 'horizontal' | 'vertical';

const DIRECTION_CLASSES: Record<ButtonGroupDirection, string> = {
  horizontal: 'inline-flex flex-row',
  vertical: 'inline-flex flex-col',
} as const satisfies Record<ButtonGroupDirection, string>;

const ATTACHED_HORIZONTAL =
  '[&>kb-button]:border-r-0 [&>kb-button:last-child]:border-r [&>kb-button+kb-button]:border-l-gray-300 [&>kb-button+kb-button]:dark:border-l-zinc-600';
const ATTACHED_VERTICAL =
  '[&>kb-button]:border-b-0 [&>kb-button:last-child]:border-b [&>kb-button+kb-button]:border-t-gray-300 [&>kb-button+kb-button]:dark:border-t-zinc-600';

const ATTACHED_CLASSES: Record<ButtonGroupDirection, string> = {
  horizontal: ATTACHED_HORIZONTAL,
  vertical: ATTACHED_VERTICAL,
} as const satisfies Record<ButtonGroupDirection, string>;

const SPACED_GAP: Record<ButtonGroupDirection, string> = {
  horizontal: 'gap-2',
  vertical: 'gap-2',
} as const satisfies Record<ButtonGroupDirection, string>;

/**
 * Groups multiple `kb-button` elements into a unified control.
 *
 * In attached mode (default), buttons share borders for a segmented appearance.
 * In spaced mode, buttons have a consistent gap between them.
 *
 * @slot - Child `kb-button` elements.
 *
 * @example
 * ```html
 * <kb-button-group>
 *   <kb-button variant="outline">LEFT</kb-button>
 *   <kb-button variant="outline">CENTER</kb-button>
 *   <kb-button variant="outline">RIGHT</kb-button>
 * </kb-button-group>
 *
 * <kb-button-group spaced>
 *   <kb-button>SAVE</kb-button>
 *   <kb-button variant="outline">CANCEL</kb-button>
 * </kb-button-group>
 * ```
 */
@customElement('kb-button-group')
export class KbButtonGroup extends KbBaseElement {
  /** Layout direction of the grouped buttons. @defaultValue 'horizontal' */
  @property({ type: String }) direction: ButtonGroupDirection = 'horizontal';
  /** Use spaced mode (gap between buttons) instead of attached mode (shared borders). @defaultValue false */
  @property({ type: Boolean }) spaced: boolean = false;
  /** Accessible label for the button group (required for screen readers). @defaultValue '' */
  @property({ type: String }) label: string = '';

  override render(): TemplateResult {
    const dirClasses = DIRECTION_CLASSES[this.direction] ?? DIRECTION_CLASSES.horizontal;

    const modeClasses = this.spaced
      ? (SPACED_GAP[this.direction] ?? SPACED_GAP.horizontal)
      : (ATTACHED_CLASSES[this.direction] ?? ATTACHED_CLASSES.horizontal);

    const classes = this.buildClasses(dirClasses, modeClasses);

    return html`<div class=${classes} role="group" aria-label=${this.label || nothing}>${this.defaultSlotContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-button-group': KbButtonGroup;
  }
}
