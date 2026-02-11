import { html, type TemplateResult } from 'lit';
import type { ComponentSize } from './types.js';

/** Status types shared by alert and toast components. */
export type StatusType = 'info' | 'success' | 'warning' | 'error';

/** SVG status icons keyed by status type. */
export const STATUS_ICONS: Record<StatusType, TemplateResult> = {
  info: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M20 6 9 17l-5-5"/></svg>`,
  warning: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  error: html`<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
} as const satisfies Record<StatusType, TemplateResult>;

/** Loading spinner dimensions per component size. */
export const LOADING_SIZE: Record<ComponentSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-3.5 h-3.5 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-5 h-5 border-2',
  xl: 'w-6 h-6 border-2',
} as const satisfies Record<ComponentSize, string>;

/** Renders a close (X) icon SVG with the given size class and stroke width. */
export function renderCloseIcon(sizeClass: string, strokeWidth: number = 2): TemplateResult {
  return html`<svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="square"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
}
