import { STYLE_PROP_KEYS, mapPropToClass, type StyleProps, type StylePropName } from './style-map.js';
import { LRUCache } from '../utils/cache.js';

export type { StyleProps, StylePropName };
export { STYLE_PROP_KEYS };

const stylePropsCache = new LRUCache<string, string>(500);

export function stylePropsToClasses(props: Partial<StyleProps>): string {
  const cacheKey = buildCacheKey(props);
  const cached = stylePropsCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const classes: string[] = [];

  for (const key of STYLE_PROP_KEYS) {
    const value = props[key];
    if (value === undefined || value === null || value === '') continue;
    const cls = mapPropToClass(key, String(value));
    if (cls) classes.push(cls);
  }

  const result = classes.join(' ');
  stylePropsCache.set(cacheKey, result);
  return result;
}

function buildCacheKey(props: Partial<StyleProps>): string {
  let key = '';
  for (const propKey of STYLE_PROP_KEYS) {
    const value = props[propKey];
    if (value !== undefined && value !== null && value !== '') {
      key += `${propKey}:${String(value)};`;
    }
  }
  return key;
}

export function extractStyleProps<T extends Record<string, unknown>>(
  allProps: T
): { styleProps: Partial<StyleProps>; restProps: Omit<T, keyof StyleProps> } {
  const styleProps: Partial<StyleProps> = {};
  const restProps = {} as Record<string, unknown>;
  const stylePropSet: ReadonlySet<string> = new Set(STYLE_PROP_KEYS);

  for (const [key, value] of Object.entries(allProps)) {
    if (stylePropSet.has(key) && typeof value === 'string') {
      (styleProps as Record<string, string>)[key] = value;
    } else {
      restProps[key] = value;
    }
  }

  return { styleProps, restProps: restProps as Omit<T, keyof StyleProps> };
}
