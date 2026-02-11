const _g = globalThis as Record<string, unknown>;
const _p: Record<string, unknown> | undefined =
  typeof _g.process === 'object' ? (_g.process as Record<string, unknown>) : undefined;
const _e = _p?.env as Record<string, string> | undefined;

/** `true` when `NODE_ENV` is absent or not `'production'`. Bundlers can dead-code-eliminate dev-only branches. */
export const __DEV__: boolean = _e?.NODE_ENV !== 'production';
