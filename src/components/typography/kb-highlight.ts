import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import type { ColorScheme } from '../../core/types.js';

const BG_MAP: Partial<Record<ColorScheme, string>> = {
  yellow: 'bg-yellow-200/60 dark:bg-yellow-500/30',
  green: 'bg-green-200/60 dark:bg-green-500/30',
  blue: 'bg-blue-200/60 dark:bg-blue-500/30',
  red: 'bg-red-200/60 dark:bg-red-500/30',
  orange: 'bg-orange-200/60 dark:bg-orange-500/30',
  purple: 'bg-purple-200/60 dark:bg-purple-500/30',
  pink: 'bg-pink-200/60 dark:bg-pink-500/30',
  gray: 'bg-gray-200/60 dark:bg-zinc-600/40',
};

const DEFAULT_BG = 'bg-yellow-200/60 dark:bg-yellow-500/30';

/**
 * Inline text highlighter for search result emphasis or annotation.
 *
 * Renders a `<mark>` element with configurable background color.
 * Supports both slot content and a `query` + `text` prop mode
 * that auto-highlights matching substrings.
 *
 * @slot - Text content to highlight.
 *
 * @example
 * ```html
 * <kb-highlight color-scheme="yellow">important text</kb-highlight>
 * <kb-highlight text="The quick brown fox" query="brown"></kb-highlight>
 * ```
 */
export class KbHighlight extends KbBaseElement {
  /** Full text to render when using `query` mode. */
  @property({ type: String }) text: string = '';
  /** Substring to highlight within `text`. Case-insensitive. */
  @property({ type: String }) query: string = '';
  /** Background color scheme. @defaultValue 'yellow' */
  @property({ type: String, attribute: 'color-scheme' }) colorScheme?: ColorScheme;

  private _getMarkClasses(): string {
    const bg = this.colorScheme ? (BG_MAP[this.colorScheme] ?? DEFAULT_BG) : DEFAULT_BG;
    return `${bg} px-0.5 text-inherit`;
  }

  override render(): TemplateResult {
    const markClasses = this._getMarkClasses();
    const wrapperClasses = this.buildClasses('inline');

    if (this.text && this.query) {
      return this._renderQueryMode(markClasses, wrapperClasses);
    }

    return html`<mark class="${wrapperClasses} ${markClasses}">${this.defaultSlotContent}</mark>`;
  }

  private _renderQueryMode(markClasses: string, wrapperClasses: string): TemplateResult {
    const parts = this._splitByQuery();
    const templates: TemplateResult[] = [];

    for (const part of parts) {
      if (part.match) {
        templates.push(html`<mark class=${markClasses}>${part.text}</mark>`);
      } else {
        templates.push(html`${part.text}`);
      }
    }

    return html`<span class=${wrapperClasses}>${templates}</span>`;
  }

  private _splitByQuery(): Array<{ text: string; match: boolean }> {
    if (!this.query) return [{ text: this.text, match: false }];

    const escaped = this.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const segments = this.text.split(regex);
    const result: Array<{ text: string; match: boolean }> = [];

    for (const segment of segments) {
      if (segment === '') continue;
      const isMatch = segment.toLowerCase() === this.query.toLowerCase();
      result.push({ text: segment, match: isMatch });
    }

    return result;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-highlight': KbHighlight;
  }
}
