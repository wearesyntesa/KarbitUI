import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { KbBaseElement } from '../../core/base-element.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

const SIZE_MAP: Record<ComponentSize, { icon: string; title: string; desc: string; py: string }> = {
  xs: { icon: 'w-8 h-8', title: 'text-sm', desc: 'text-xs', py: 'py-6' },
  sm: { icon: 'w-10 h-10', title: 'text-sm', desc: 'text-xs', py: 'py-8' },
  md: { icon: 'w-12 h-12', title: 'text-base', desc: 'text-sm', py: 'py-10' },
  lg: { icon: 'w-14 h-14', title: 'text-lg', desc: 'text-sm', py: 'py-12' },
  xl: { icon: 'w-16 h-16', title: 'text-xl', desc: 'text-base', py: 'py-16' },
} as const satisfies Record<ComponentSize, { icon: string; title: string; desc: string; py: string }>;

/**
 * Empty state placeholder with icon, title, description, and action slot.
 *
 * Used to communicate that a section has no data and optionally offer
 * a primary action to populate it.
 *
 * @slot icon - Icon or illustration.
 * @slot action - Primary action button(s).
 * @slot - Additional body content rendered below the description.
 *
 * @example
 * ```html
 * <kb-empty-state
 *   title="No projects yet"
 *   description="Create your first project to get started."
 * >
 *   <svg slot="icon" ...></svg>
 *   <kb-button slot="action">CREATE PROJECT</kb-button>
 * </kb-empty-state>
 * ```
 */
export class KbEmptyState extends KbBaseElement<'icon' | 'action'> {
  static override hostDisplay = 'block' as const;

  /** Main title text. */
  @property({ type: String }) title: string = '';
  /** Supporting description text. */
  @property({ type: String }) description: string = '';
  /** Size preset. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';

  override render(): TemplateResult {
    const s = SIZE_MAP[this.size] ?? SIZE_MAP.md;
    const iconEl = this.slotted('icon');
    const actionEl = this.slotted('action');

    const wrapperClasses = this.buildClasses('flex flex-col items-center text-center', s.py, 'px-4');

    return html`
      <div class=${wrapperClasses}>
        ${iconEl ? html`<div class=${cx(s.icon, kbClasses.textMuted, 'mb-4')}>${iconEl}</div>` : nothing}
        ${
          this.title
            ? html`<div class=${cx(s.title, 'font-semibold', kbClasses.textPrimary)}>${this.title}</div>`
            : nothing
        }
        ${
          this.description
            ? html`<p class=${cx(s.desc, kbClasses.textSecondary, 'mt-1.5 max-w-sm')}>${this.description}</p>`
            : nothing
        }
        ${actionEl ? html`<div class="mt-4">${actionEl}</div>` : nothing}
        ${this.defaultSlotContent}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-empty-state': KbEmptyState;
  }
}
