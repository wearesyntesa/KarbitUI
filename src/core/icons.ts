import { html, type TemplateResult } from 'lit';
import type { ComponentSize } from './types.js';

export type StatusType = 'info' | 'success' | 'warning' | 'error';

/** Info circle icon — individually tree-shakeable. */
export const ICON_INFO: TemplateResult = html`<svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
/** Success checkmark icon — individually tree-shakeable. */
export const ICON_SUCCESS: TemplateResult = html`<svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`;
/** Warning triangle icon — individually tree-shakeable. */
export const ICON_WARNING: TemplateResult = html`<svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
/** Error X-circle icon — individually tree-shakeable. */
export const ICON_ERROR: TemplateResult = html`<svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;

/** @deprecated Use individual `ICON_INFO`, `ICON_SUCCESS`, `ICON_WARNING`, `ICON_ERROR` exports for tree-shaking. */
export const STATUS_ICONS: Record<StatusType, TemplateResult> = {
  info: ICON_INFO,
  success: ICON_SUCCESS,
  warning: ICON_WARNING,
  error: ICON_ERROR,
} as const satisfies Record<StatusType, TemplateResult>;

export const LOADING_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-3.5 h-3.5 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-5 h-5 border-2',
  xl: 'w-6 h-6 border-2',
} as const satisfies Record<ComponentSize, string>;

/** Renders a close (X) icon SVG with the given size class and stroke width. */
export function renderCloseIcon(sizeClass: string, strokeWidth: number = 2): TemplateResult {
  return html`<svg aria-hidden="true" class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
}
