import type { HasChanged } from 'lit';

/**
 * Compares two arrays shallowly by reference-equality of each element.
 * Returns `true` when the arrays are considered equal (no change needed).
 */
export function shallowArrayEqual(a: readonly unknown[], b: readonly unknown[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Lit `hasChanged` comparator for array-typed reactive properties.
 * Prevents a re-render when the new array has the same length and every
 * element is the same reference as the previous array.
 */
export const arrayHasChanged: HasChanged = (value: unknown, old: unknown): boolean => {
  if (!(Array.isArray(value) && Array.isArray(old))) return value !== old;
  return !shallowArrayEqual(value as readonly unknown[], old as readonly unknown[]);
};
