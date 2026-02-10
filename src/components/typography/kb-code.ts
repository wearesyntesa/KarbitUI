import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';

/**
 * Monospace code display element. Inline by default, block when `block` is set.
 *
 * @slot - Code content.
 *
 * @example
 * ```html
 * <kb-code>const x = 42;</kb-code>
 * <kb-code block>
 *   function hello() {
 *     console.log("KARBIT");
 *   }
 * </kb-code>
 * ```
 */
@customElement('kb-code')
export class KbCode extends KbBaseElement {
  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    super.connectedCallback();
    this._syncHostDisplay();
  }

  @property({ type: Boolean }) block: boolean = false;

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (changed.has('block')) {
      this._syncHostDisplay();
    }
  }

  private _syncHostDisplay(): void {
    this.style.display = this.block ? 'block' : '';
  }

  override render() {
    const baseClasses = 'font-mono bg-gray-50 border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 text-sm text-slate-900 dark:text-zinc-50';

    if (this.block) {
      const classes = this.buildClasses(baseClasses, 'block p-4 overflow-x-auto whitespace-pre');
      return html`<pre class=${classes}><code>${this.defaultSlotContent}</code></pre>`;
    }

    const classes = this.buildClasses(baseClasses, 'inline px-1.5 py-0.5');
    return html`<code class=${classes}>${this.defaultSlotContent}</code>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-code': KbCode;
  }
}
