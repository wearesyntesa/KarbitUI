import { LRUCache } from '../utils/cache.js';
import { __DEV__ } from '../utils/dev.js';
import type { Simplify } from './utility-types.js';

export type RecipeVariantRecord = Record<string, Record<string, string>>;

/** All variant keys optional — useful for partial overrides. */
export type RecipeVariantProps<V extends RecipeVariantRecord> = {
  [K in keyof V]?: keyof V[K] & string;
};

type RequiredVariantProps<V extends RecipeVariantRecord, D extends Partial<RecipeVariantProps<V>>> = Simplify<
  {
    [K in keyof V as K extends keyof D ? never : K]: keyof V[K] & string;
  } & {
    [K in keyof V as K extends keyof D ? K : never]?: keyof V[K] & string;
  }
>;

export type CompoundVariant<V extends RecipeVariantRecord> = {
  [K in keyof V]?: keyof V[K] & string;
} & { readonly class: string };

export interface RecipeConfig<V extends RecipeVariantRecord, D extends Partial<RecipeVariantProps<V>> = object> {
  readonly base: string;
  readonly variants: V;
  readonly defaultVariants?: D & Partial<RecipeVariantProps<V>>;
  readonly compoundVariants?: readonly CompoundVariant<V>[];
}

export interface RecipeFunction<V extends RecipeVariantRecord, D extends Partial<RecipeVariantProps<V>>> {
  (props?: RequiredVariantProps<V, D>): string;
  readonly variantKeys: readonly (keyof V & string)[];
  readonly config: RecipeConfig<V, D>;
}

/** Derives the union of allowed values for a named variant key from a recipe function. */
export type InferVariant<
  R extends RecipeFunction<RecipeVariantRecord, object>,
  K extends R extends RecipeFunction<infer V, infer _D> ? keyof V & string : never,
> = R extends RecipeFunction<infer V, infer _D> ? (K extends keyof V ? keyof V[K] & string : never) : never;

/** Extracts all variant props from a recipe function as a mapped object type (all required). */
export type InferAllVariants<R extends RecipeFunction<RecipeVariantRecord, object>> =
  R extends RecipeFunction<infer V, infer _D> ? Simplify<{ [K in keyof V]: keyof V[K] & string }> : never;

/** Extracts variant props respecting defaultVariants — defaulted keys become optional. */
export type InferRecipeProps<R extends RecipeFunction<RecipeVariantRecord, object>> =
  R extends RecipeFunction<infer V, infer D> ? Simplify<RequiredVariantProps<V, D>> : never;

const recipeCache: LRUCache<string, string> = new LRUCache<string, string>(200);
let recipeIdCounter = 0;

/** Prevents 'class' from being used as a variant key, since it collides with CompoundVariant's output property. */
type GuardReservedKeys<V extends RecipeVariantRecord> = 'class' extends keyof V
  ? RecipeVariantRecord & { class: never }
  : RecipeVariantRecord;

export function recipe<V extends GuardReservedKeys<V>, D extends Partial<RecipeVariantProps<V>> = object>(
  config: RecipeConfig<V, D>,
): RecipeFunction<V, D> {
  const { base, variants, defaultVariants, compoundVariants } = config;
  const id = recipeIdCounter++;
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

    let cacheKey = `${id}:`;
    for (const k of variantKeys) {
      cacheKey += `${k}:${merged[k] ?? ''};`;
    }

    const cached = recipeCache.get(cacheKey);
    if (cached !== undefined) return cached;

    let result = base;

    for (const key of variantKeys) {
      const value = merged[key];
      if (value === undefined) continue;
      const group = variants[key];
      if (group !== undefined && value in group) {
        const cls = group[value];
        if (cls) result = result ? `${result} ${cls}` : cls;
      } else if (__DEV__) {
        // biome-ignore lint/suspicious/noConsole: intentional dev-mode warning
        console.warn(`[KarbitUI] Unknown variant value "${value}" for key "${key}"`);
      }
    }

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
        if (matches && compound.class) {
          result = result ? `${result} ${compound.class}` : compound.class;
        }
      }
    }

    recipeCache.set(cacheKey, result);
    return result;
  };

  const recipeFn = fn as RecipeFunction<V, D>;
  Object.assign(recipeFn, { variantKeys, config } as const);

  return recipeFn;
}
