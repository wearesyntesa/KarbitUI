import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const SIZE_PADDING: Record<ComponentSize, string> = {
  xs: 'p-4',
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
} as const satisfies Record<ComponentSize, string>;

const SIZE_TEXT: Record<ComponentSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
} as const satisfies Record<ComponentSize, string>;

const SIZE_ICON: Record<ComponentSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',
} as const satisfies Record<ComponentSize, string>;

/**
 * File upload dropzone with drag-and-drop support, file list display, and size/type validation.
 *
 * @fires kb-file-select - Fires when files are selected. Detail: `{ files: File[] }`.
 * @fires kb-file-remove - Fires when a file is removed. Detail: `{ name: string, index: number }`.
 *
 * @example
 * ```html
 * <kb-file-upload accept=".pdf,.jpg" multiple max-files="5"></kb-file-upload>
 * ```
 */
export class KbFileUpload extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Accepted file types (MIME types or extensions). */
  @property({ type: String }) accept?: string;
  /** Allow multiple file selection. @defaultValue false */
  @property({ type: Boolean }) multiple: boolean = false;
  /** Maximum file size in bytes. 0 = unlimited. @defaultValue 0 */
  @property({ type: Number, attribute: 'max-size' }) maxSize: number = 0;
  /** Maximum number of files. 0 = unlimited. @defaultValue 0 */
  @property({ type: Number, attribute: 'max-files' }) maxFiles: number = 0;
  /** Display size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Form field name. */
  @property({ type: String }) name?: string;

  @state() private _files: File[] = [];
  @state() private _dragging: boolean = false;

  /** Get the currently selected files. */
  get files(): readonly File[] {
    return this._files;
  }

  private _handleDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!this.disabled) this._dragging = true;
  }

  private _handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    if (e.currentTarget === e.target || !(e.currentTarget as Element).contains(e.relatedTarget as Node)) {
      this._dragging = false;
    }
  }

  private _handleDrop(e: DragEvent): void {
    e.preventDefault();
    this._dragging = false;
    if (this.disabled) return;
    const dropped = Array.from(e.dataTransfer?.files ?? []);
    this._processFiles(dropped);
  }

  private _handleClick(): void {
    if (this.disabled) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = this.multiple;
    if (this.accept) input.accept = this.accept;
    input.addEventListener('change', () => {
      const selected = Array.from(input.files ?? []);
      this._processFiles(selected);
    });
    input.click();
  }

  private _processFiles(incoming: File[]): void {
    let filtered = incoming;

    if (this.maxSize > 0) {
      filtered = filtered.filter((f) => f.size <= this.maxSize);
    }

    if (this.multiple) {
      const combined = [...this._files, ...filtered];
      this._files = this.maxFiles > 0 ? combined.slice(0, this.maxFiles) : combined;
    } else {
      filtered = filtered.slice(0, 1);
      this._files = filtered;
    }

    this.emit('kb-file-select', { files: this._files });
  }

  private _removeFile(index: number): void {
    const file = this._files[index];
    if (!file) return;
    this._files = this._files.filter((_, i) => i !== index);
    this.emit('kb-file-remove', { name: file.name, index });
  }

  private _formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  private _renderFileList(): TemplateResult | typeof nothing {
    if (this._files.length === 0) return nothing;
    return html`
      <div class="mt-3 flex flex-col gap-1">
        ${this._files.map(
          (file, i) => html`
            <div class=${cx('flex items-center justify-between', SIZE_TEXT[this.size], kbClasses.textPrimary, 'py-1', kbClasses.borderBottom)}>
              <div class="flex items-center gap-2 min-w-0">
                <svg class="w-4 h-4 shrink-0 ${kbClasses.textMuted}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/>
                </svg>
                <span class="truncate">${file.name}</span>
                <span class=${cx(kbClasses.textMuted, 'text-xs shrink-0')}>${this._formatSize(file.size)}</span>
              </div>
              <button
                type="button"
                class=${cx('cursor-pointer shrink-0 p-1', kbClasses.textMuted, kbClasses.hoverTextPrimary, kbClasses.transitionColors)}
                @click=${(): void => this._removeFile(i)}
                aria-label=${`Remove ${file.name}`}
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          `,
        )}
      </div>
    `;
  }

  override render(): TemplateResult {
    const s = this.size;
    const dropzoneClasses = this.buildClasses(
      'flex flex-col items-center justify-center text-center cursor-pointer select-none',
      SIZE_PADDING[s],
      this._dragging
        ? 'border-2 border-dashed border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
        : this.invalid
          ? 'border border-dashed border-red-500 dark:border-red-400'
          : `border border-dashed ${kbClasses.borderColor} hover:border-gray-400 dark:hover:border-zinc-500`,
      kbClasses.transitionColors,
      this.disabled ? kbClasses.disabledLook : '',
    );

    return html`
      <div>
        <div
          class=${dropzoneClasses}
          role="button"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          @click=${this._handleClick}
          @dragover=${this._handleDragOver}
          @dragleave=${this._handleDragLeave}
          @drop=${this._handleDrop}
          @keydown=${(e: KeyboardEvent): void => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this._handleClick();
            }
          }}
        >
          <svg class="${cx(SIZE_ICON[s], kbClasses.textMuted, 'mb-2')}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>
          </svg>
          <span class=${cx(SIZE_TEXT[s], kbClasses.textPrimary, 'font-medium')}>
            ${this._dragging ? 'Drop files here' : 'Click or drag files to upload'}
          </span>
          ${this.accept ? html`<span class=${cx('mt-1', kbClasses.label)}>${this.accept}</span>` : nothing}
          ${this.maxSize > 0 ? html`<span class=${cx('mt-0.5', kbClasses.label)}>Max ${this._formatSize(this.maxSize)}</span>` : nothing}
        </div>
        ${this._renderFileList()}
      </div>
      ${this.name ? html`<input type="hidden" name=${this.name} .value=${this._files.map((f) => f.name).join(',')} />` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-file-upload': KbFileUpload;
  }
}
