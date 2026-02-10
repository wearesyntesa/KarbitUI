import { cx } from '../utils/cx.js';
import { LRUCache } from '../utils/cache.js';

export type RecipeVariantRecord = Record<string, Record<string, string>>;

type RecipeVariantProps<V extends RecipeVariantRecord> = {
  [K in keyof V]?: keyof V[K] & string;
};

type RequiredVariantProps<
  V extends RecipeVariantRecord,
  D extends Partial<RecipeVariantProps<V>>
> = {
  [K in keyof V as K extends keyof D ? never : K]: keyof V[K] & string;
} & {
  [K in keyof V as K extends keyof D ? K : never]?: keyof V[K] & string;
};

export type CompoundVariant<V extends RecipeVariantRecord> = {
  [K in keyof V]?: keyof V[K] & string;
} & { readonly class: string };

export interface RecipeConfig<
  V extends RecipeVariantRecord,
  D extends Partial<RecipeVariantProps<V>> = object
> {
  readonly base: string;
  readonly variants: V;
  readonly defaultVariants?: D & Partial<RecipeVariantProps<V>>;
  readonly compoundVariants?: readonly CompoundVariant<V>[];
}

export interface RecipeFunction<
  V extends RecipeVariantRecord,
  D extends Partial<RecipeVariantProps<V>>
> {
  (props?: RequiredVariantProps<V, D>): string;
  readonly variantKeys: readonly (keyof V & string)[];
  readonly config: RecipeConfig<V, D>;
}

const recipeCache = new LRUCache<string, string>(200);

export function recipe<
  V extends RecipeVariantRecord,
  D extends Partial<RecipeVariantProps<V>> = object
>(config: RecipeConfig<V, D>): RecipeFunction<V, D> {
  const { base, variants, defaultVariants, compoundVariants } = config;
  const variantKeys = Object.keys(variants) as (keyof V & string)[];

  const fn = (props?: RequiredVariantProps<V, D>): string => {
    const merged: Record<string, string> = {};

    for (const key of variantKeys) {
      const fromProps = props?.[key as keyof typeof props] as string | undefined;
      const fromDefaults = defaultVariants?.[key as keyof typeof defaultVariants] as string | undefined;
      const value = fromProps ?? fromDefaults;
      if (value !== undefined) {
        merged[key] = value;
      }
    }

    const cacheKey = variantKeys
      .map(k => `${k}:${merged[k] ?? ''}`)
      .join(';');

    const cached = recipeCache.get(cacheKey);
    if (cached !== undefined) return cached;

    const variantClasses: string[] = [];

    for (const key of variantKeys) {
      const value = merged[key];
      if (value === undefined) continue;
      const group = variants[key];
      if (group !== undefined && value in group) {
        variantClasses.push(group[value]!);
      }
    }

    const compoundClasses: string[] = [];
    if (compoundVariants) {
      for (const compound of compoundVariants) {
        let matches = true;
        for (const key of variantKeys) {
          const conditionValue = compound[key];
          if (conditionValue !== undefined && conditionValue !== merged[key]) {
            matches = false;
            break;
          }
        }
        if (matches) compoundClasses.push(compound.class);
      }
    }

    const result = cx(base, ...variantClasses, ...compoundClasses);
    recipeCache.set(cacheKey, result);
    return result;
  };

  const recipeFn = fn as RecipeFunction<V, D>;
  Object.defineProperty(recipeFn, 'variantKeys', { value: variantKeys, writable: false });
  Object.defineProperty(recipeFn, 'config', { value: config, writable: false });

  return recipeFn;
}
