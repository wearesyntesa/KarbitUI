import { html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';

/**
 * Callback that transforms raw code text into highlighted HTML.
 *
 * @param code - Raw source code string.
 * @param language - Language identifier (e.g. `"typescript"`, `"html"`).
 * @returns HTML string with syntax-highlighted markup.
 */
export type CodeHighlighter = (code: string, language: string) => string;

/**
 * Monospace code display element. Inline by default, block when `block` is set.
 *
 * Block mode includes a hover-reveal copy-to-clipboard button. Set `filename`
 * to display a header bar above the code block with the file name.
 *
 * **Syntax highlighting** is supported via a pluggable hook. Set
 * `KbCode.highlighter` to a function that takes `(code, language)` and returns
 * an HTML string. Then set the `language` prop on individual instances.
 *
 * @slot - Code content.
 *
 * @example
 * ```html
 * <kb-code>const x = 42;</kb-code>
 * <kb-code block language="typescript">
 *   function hello() {
 *     console.log("KARBIT");
 *   }
 * </kb-code>
 * <kb-code block filename="src/main.ts" language="typescript">
 *   import '@wearesyntesa/karbit-ui';
 * </kb-code>
 * ```
 *
 * @example
 * ```typescript
 * // Wire up Prism.js
 * import Prism from 'prismjs';
 * import { KbCode } from '@wearesyntesa/karbit-ui';
 *
 * KbCode.highlighter = (code, lang) =>
 *   Prism.languages[lang]
 *     ? Prism.highlight(code, Prism.languages[lang], lang)
 *     : code;
 * ```
 *
 * @example
 * ```typescript
 * // Wire up highlight.js
 * import hljs from 'highlight.js';
 * import { KbCode } from '@wearesyntesa/karbit-ui';
 *
 * KbCode.highlighter = (code, lang) => {
 *   const result = lang
 *     ? hljs.highlight(code, { language: lang })
 *     : hljs.highlightAuto(code);
 *   return result.value;
 * };
 * ```
 */
@customElement('kb-code')
export class KbCode extends KbBaseElement {
  /** Pluggable syntax highlighter. Set once to enable highlighting for all `kb-code` instances with a `language` prop. */
  static highlighter: CodeHighlighter | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._syncHostDisplay();
    this._rawText = this._extractRawText();
    this._cleanupSlotForHighlighting();
  }

  /** Display as a full-width block with copy button. When `false`, renders as inline `<code>`. @defaultValue false */
  @property({ type: Boolean }) block: boolean = false;
  /** Language identifier for syntax highlighting (e.g. `'typescript'`, `'html'`). Requires `KbCode.highlighter` to be set. */
  @property({ type: String }) language: string = '';
  /** File name displayed in a header bar above block code. Only visible when `block` is true. */
  @property({ type: String }) filename: string = '';

  @state() private _copied = false;
  private _rawText: string = '';

  override updated(changed: Map<PropertyKey, unknown>): void {
    super.updated(changed);
    if (changed.has('block')) {
      this._syncHostDisplay();
    }
  }

  private _syncHostDisplay(): void {
    this.style.display = this.block ? 'block' : '';
  }

  private _extractRawText(): string {
    return this.defaultSlotContent
      .map((n) => n.textContent ?? '')
      .join('');
  }

  /** When highlighting is active, remove original slot nodes so they don't appear alongside Lit's rendered output in Light DOM. */
  private _cleanupSlotForHighlighting(): void {
    if (!this.language || !KbCode.highlighter) return;
    for (const node of this.defaultSlotContent) {
      node.parentNode?.removeChild(node);
    }
  }

  private _getHighlightedContent(): ReturnType<typeof html> | ReturnType<typeof unsafeHTML> | Node[] {
    if (!this.language || !KbCode.highlighter) {
      return this.defaultSlotContent;
    }

    const highlighted = KbCode.highlighter(this._rawText, this.language);
    return unsafeHTML(highlighted);
  }

  private _copyTimeout: ReturnType<typeof setTimeout> | undefined;

  private async _handleCopy(): Promise<void> {
    const text = this._rawText || (this.querySelector('code')?.textContent ?? '');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    this._copied = true;
    clearTimeout(this._copyTimeout);
    this._copyTimeout = setTimeout(() => {
      this._copied = false;
    }, 1500);
  }

  override render() {
    const baseClasses = [
      'font-mono bg-gray-50 border border-gray-200',
      'dark:bg-zinc-800 dark:border-zinc-700',
      'text-sm text-slate-900 dark:text-zinc-50',
      kbClasses.transition,
    ].join(' ');

    const content = this._getHighlightedContent();

    if (this.block) {
      const wrapperClasses = 'relative group/code';

      const hasFilename = this.filename !== '';
      const preClasses = this.buildClasses(
        baseClasses,
        'block p-4 overflow-x-auto whitespace-pre',
        'hover:bg-gray-100/50 dark:hover:bg-zinc-700/30',
        hasFilename ? 'border-t-0' : '',
      );

      const btnClasses = [
        `absolute ${hasFilename ? 'top-10' : 'top-2'} right-2 z-10`,
        'opacity-0 group-hover/code:opacity-100',
        'inline-flex items-center justify-center',
        'w-7 h-7 text-xs',
        'border border-gray-200 dark:border-zinc-600',
        'bg-white dark:bg-zinc-800',
        'text-slate-500 dark:text-zinc-400',
        'hover:text-slate-900 dark:hover:text-zinc-100',
        'hover:border-gray-400 dark:hover:border-zinc-400',
        'cursor-pointer select-none',
        kbClasses.transition,
        kbClasses.focus,
        this._copied ? 'opacity-100 text-green-600 dark:text-green-400 border-green-400 dark:border-green-500' : '',
      ].join(' ');

      const clipboardIcon = html`<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><rect x="9" y="9" width="13" height="13"/><path d="M5 15H4V4h11v1"/></svg>`;
      const checkIcon = html`<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M20 6 9 17l-5-5"/></svg>`;

      const filenameHeader = hasFilename
        ? html`<div class="flex items-center px-4 py-2 border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80">
            <span class="font-mono text-xs ${kbClasses.textSecondary} select-none">${this.filename}</span>
          </div>`
        : nothing;

      return html`
        <div class=${wrapperClasses}>
          ${filenameHeader}
          <button
            type="button"
            class=${btnClasses}
            aria-label=${this._copied ? 'Copied' : 'Copy code'}
            @click=${() => this._handleCopy()}
          >${this._copied ? checkIcon : clipboardIcon}</button>
          <pre class=${preClasses}><code>${content}</code></pre>
        </div>
      `;
    }

    const classes = this.buildClasses(
      baseClasses,
      'inline px-1.5 py-0.5',
      'hover:bg-gray-100 dark:hover:bg-zinc-700/50',
    );
    return html`<code class=${classes}>${content}</code>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-code': KbCode;
  }
}
