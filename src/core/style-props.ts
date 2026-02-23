import { LRUCache } from '../utils/cache.js';
import { mapPropToClass, STYLE_PROP_KEYS, type StylePropName, type StyleProps } from './style-map.js';

export type { StyleProps, StylePropName };
export { STYLE_PROP_KEYS };

/** LRU cache — promotes hot entries on access instead of FIFO eviction. */
// biome-ignore lint/nursery/useExplicitType: type inferred from constructor generic
const stylePropsCache = new LRUCache<string, string>(500);

function buildStyleClasses(el: Record<string, unknown>, excluded?: ReadonlySet<string>): string {
  let result = '';
  for (const key of STYLE_PROP_KEYS) {
    if (excluded?.has(key)) continue;
    const value = el[key];
    if (typeof value === 'string' && value !== '') {
      const cls = mapPropToClass(key as StylePropName, value);
      if (cls) result = result ? `${result} ${cls}` : cls;
    }
  }
  return result;
}

/**
 * Two-pass style prop resolution. First pass builds the cache key with zero
 * heap allocation - no arrays created. On cache hit, returns immediately.
 * Only on cache miss does the second pass allocate and map classes.
 */
export function resolveStyleClasses(el: Record<string, unknown>, excluded?: ReadonlySet<string>): string {
  let cacheKey = '';

  for (const key of STYLE_PROP_KEYS) {
    if (excluded?.has(key)) continue;
    const value = el[key];
    if (typeof value === 'string' && value !== '') {
      cacheKey += `${key}:${value};`;
    }
  }

  if (!cacheKey) return '';

  const cached = stylePropsCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const result = buildStyleClasses(el, excluded);
  stylePropsCache.set(cacheKey, result);
  return result;
}

/** @deprecated Use `resolveStyleClasses` for single-pass resolution. */
export function stylePropsToClasses(props: Partial<StyleProps>): string {
  return resolveStyleClasses(props as Record<string, unknown>);
}

const STYLE_PROP_SET: ReadonlySet<string> = new Set(STYLE_PROP_KEYS);

export function extractStyleProps<T extends Record<string, unknown>>(
  allProps: T,
): { styleProps: Partial<StyleProps>; restProps: Omit<T, keyof StyleProps> } {
  const styleProps: Partial<StyleProps> = {};
  const restProps = {} as Record<string, unknown>;

  for (const [key, value] of Object.entries(allProps)) {
    if (STYLE_PROP_SET.has(key) && typeof value === 'string') {
      (styleProps as Record<string, string>)[key] = value;
    } else {
      restProps[key] = value;
    }
  }

  return { styleProps, restProps: restProps as Omit<T, keyof StyleProps> };
}
