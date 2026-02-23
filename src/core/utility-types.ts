export type Simplify<T> = { [K in keyof T]: T[K] } & {};

/** Like `Omit` but constrains `K` to actual keys of `T` - catches typos at compile time. */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/** Extracts the union of all value types from an object type. */
export type ValueOf<T> = T[keyof T];

/** Extracts keys of `T` that are required (non-optional). */
// biome-ignore lint/complexity/noBannedTypes: canonical TS pattern for detecting optional keys - `{} extends Pick<T, K>` is the standard approach
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

/** Extracts keys of `T` that are optional. */
// biome-ignore lint/complexity/noBannedTypes: canonical TS pattern for detecting optional keys - `{} extends Pick<T, K>` is the standard approach
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

/**
 * A union of a fixed set of string literals `T` plus an arbitrary string,
 * while preserving autocomplete for the known literals.
 *
 * @example
 * type Size = LiteralUnion<'sm' | 'md' | 'lg'>;
 * const s: Size = 'xl'; // valid - arbitrary strings accepted
 * const s2: Size = 'sm'; // valid - IDE still suggests 'sm' | 'md' | 'lg'
 */
export type LiteralUnion<T extends Base, Base = string> = T | (Base & {});
