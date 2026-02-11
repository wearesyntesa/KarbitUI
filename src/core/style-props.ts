import { LRUCache } from '../utils/cache.js';
import { mapPropToClass, STYLE_PROP_KEYS, type StylePropName, type StyleProps } from './style-map.js';

export type { StyleProps, StylePropName };
export { STYLE_PROP_KEYS };

const stylePropsCache: LRUCache<string, string> = new LRUCache<string, string>(500);

/**
 * Single-pass style prop resolution. Builds the cache key and maps classes
 * in one iteration of STYLE_PROP_KEYS. On cache hit the pre-computed classes
 * are returned directly; on miss the already-collected pairs are mapped
 * without re-reading the element.
 */
export function resolveStyleClasses(el: Record<string, unknown>): string {
  let cacheKey = '';
  let pairCount = 0;
  const pairKeys: StylePropName[] = [];
  const pairVals: string[] = [];

  for (const key of STYLE_PROP_KEYS) {
    const value = el[key];
    if (typeof value === 'string' && value !== '') {
      cacheKey += `${key}:${value};`;
      pairKeys[pairCount] = key;
      pairVals[pairCount] = value;
      pairCount++;
    }
  }

  if (!pairCount) return '';

  const cached = stylePropsCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let result = '';
  for (let i = 0; i < pairCount; i++) {
    const key = pairKeys[i] as StylePropName;
    const val = pairVals[i] as string;
    const cls = mapPropToClass(key, val);
    if (cls) {
      result = result ? `${result} ${cls}` : cls;
    }
  }

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
