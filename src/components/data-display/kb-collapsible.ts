import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { cx } from '../../utils/cx.js';

/**
 * Standalone animated expand/collapse panel.
 *
 * Unlike `<kb-accordion>`, this component does not render a trigger button.
 * The consumer controls the `open` property from an external trigger.
 *
 * @slot - Collapsible body content (hidden when collapsed).
 *
 * @fires kb-toggle - Dispatched when open state changes, with `detail.open`.
 *
 * @example
 * ```html
 * <button onclick="this.nextElementSibling.open = !this.nextElementSibling.open">Toggle</button>
 * <kb-collapsible>
 *   <p>Collapsible content goes here.</p>
 * </kb-collapsible>
 * ```
 */
export class KbCollapsible extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Whether the panel is expanded. Reflected to attribute for CSS targeting. @defaultValue false */
  @property({ type: Boolean, reflect: true }) open: boolean = false;
  /** Prevents toggling and applies disabled styles. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;

  /** Programmatically toggle the panel. No-ops when disabled. */
  toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
    this.emit('kb-toggle', { open: this.open });
  }

  override render(): TemplateResult {
    const wrapperClasses = this.buildClasses(
      'grid transition-[grid-template-rows] duration-200 ease-in-out',
      this.open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
    );

    const innerClasses: string = cx('overflow-hidden', this.disabled ? 'opacity-40 pointer-events-none' : '');

    return html`
      <div class=${wrapperClasses}>
        <div class=${innerClasses}>
          ${this.defaultSlotContent}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-collapsible': KbCollapsible;
  }
}
