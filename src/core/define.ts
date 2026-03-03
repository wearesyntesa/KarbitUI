import { isServer } from 'lit';

/**
 * Safely defines a custom element, guarding against server-side rendering
 * environments and duplicate registrations.
 */
export function define(tagName: string, ctor: CustomElementConstructor): void {
  if (isServer) return;
  if (typeof customElements !== 'undefined' && !customElements.get(tagName)) {
    customElements.define(tagName, ctor);
  }
}
