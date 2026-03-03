import type { PropertyDeclaration } from 'lit';
import { isServer, LitElement } from 'lit';
import { type ClassInput, cx } from '../utils/cx.js';
import type { KbEventDetailMap } from './events.js';
import { STYLE_PROP_DEFS, STYLE_PROP_KEYS, type StyleProps } from './style-map.js';
import { resolveStyleClasses, stylePropsToClasses } from './style-props.js';

type LitPropertyMap = Record<string, PropertyDeclaration>;

const EMPTY_NODES: readonly Node[] = [];

function buildLitProperties(): LitPropertyMap {
  const props: LitPropertyMap = {};
  for (const key of STYLE_PROP_KEYS) {
    const def = STYLE_PROP_DEFS[key];
    props[key] = {
      type: String,
      reflect: false,
      attribute: def.attribute ?? key,
    };
  }
  return props;
}

const GENERATED_STYLE_PROPERTIES: LitPropertyMap = buildLitProperties();

export type HostDisplay = '' | 'block' | 'inline-block' | 'flex' | 'grid' | 'inline-flex' | 'inline-grid' | 'contents';

/**
 * Base element for all KarbitUI components.
 * Uses Light DOM. Supports Chakra-like style props mapped to Tailwind classes.
 *
 * Style props are typed via declaration merging with the `StyleProps` interface
 * (see below the class). Consumers get full autocomplete for Tailwind-mapped
 * values (e.g. `gap="4"`, `bg="blue-500"`) while still accepting arbitrary
 * strings via the `(string & {})` escape hatch on each value type.
 */
// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: intentional Lit pattern - declaration merging adds StyleProps to the class
export class KbBaseElement<S extends string = string> extends LitElement {
  static hostDisplay: HostDisplay = '';
  static override get properties(): LitPropertyMap {
    return {
      ...LitElement.properties,
      ...GENERATED_STYLE_PROPERTIES,
    };
  }

  override createRenderRoot(): this {
    if (isServer) return this;
    const anchor = document.createComment('');
    this.prepend(anchor);
    this.renderOptions.renderBefore = anchor;
    return this;
  }

  override connectedCallback(): void {
    this.captureDefaultSlotContent();
    const display = (this.constructor as typeof KbBaseElement).hostDisplay;
    if (display && !this.style.display) {
      this.style.display = display;
    }
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this._slotObserver?.disconnect();
    this._slotObserver = undefined;
    super.disconnectedCallback();
  }

  private _defaultSlotNodes: Node[] | undefined;
  private _captureScheduled: boolean = false;
  private _slotCache: Map<string, Element | null> = new Map();
  private _slotObserver: MutationObserver | undefined;
  private _cachedStyleClasses: string = '';

  protected captureDefaultSlotContent(): void {
    if (isServer) return;
    if (this._defaultSlotNodes !== undefined || this._captureScheduled) return;
    this._captureScheduled = true;
    // Defer past React's useLayoutEffect so children are present before capture.
    Promise.resolve().then(() => {
      this._captureScheduled = false;
      if (!this.isConnected) return;
      this._doCapture();
      this.requestUpdate();
    });
  }

  private _doCapture(): void {
    this._defaultSlotNodes = Array.from(this.childNodes).filter(
      (n) =>
        !(n instanceof Element && n.hasAttribute('slot')) &&
        (n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && (n.textContent?.trim() ?? '') !== '')),
    );
  }

  protected get defaultSlotContent(): Node[] {
    return (this._defaultSlotNodes ?? EMPTY_NODES) as Node[];
  }

  /**
   * Shows or hides the captured default slot content nodes.
   *
   * In Light DOM, captured nodes remain as direct host children and are always
   * visible to the browser even when `render()` returns `nothing` for them.
   * Call this method to imperatively toggle their visibility when conditional
   * rendering cannot suppress them (e.g. loading states, closed overlays).
   *
   * Text nodes are wrapped in a `<span data-kb-slot>` on first call since they
   * have no `style` property of their own.
   */
  protected setDefaultSlotVisible(visible: boolean): void {
    if (isServer) return;
    for (const node of this._defaultSlotNodes ?? EMPTY_NODES) {
      if (node instanceof HTMLElement) {
        node.style.display = visible ? '' : 'none';
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Lazily wrap text nodes so we can toggle display on them
        let wrapper = this._defaultSlotTextWrappers.get(node);
        if (!wrapper) {
          wrapper = document.createElement('span');
          wrapper.dataset.kbSlot = '';
          node.parentNode?.insertBefore(wrapper, node);
          wrapper.appendChild(node);
          this._defaultSlotTextWrappers.set(node, wrapper);
        }
        wrapper.style.display = visible ? '' : 'none';
      }
    }
  }

  private _defaultSlotTextWrappers = new WeakMap<Node, HTMLSpanElement>();

  protected slotted(name: S): Element | null {
    if (isServer) return null;
    if (this._slotCache.has(name)) {
      return this._slotCache.get(name) ?? null;
    }
    if (!this._slotObserver) {
      this._slotObserver = new MutationObserver(() => {
        this._slotCache.clear();
        this.requestUpdate();
      });
      this._slotObserver.observe(this, { childList: true });
    }
    const el = this.querySelector(`[slot="${name}"]`);
    this._slotCache.set(name, el);
    return el;
  }

  protected collectStyleProps(): Partial<StyleProps> {
    const props: Record<string, string> = {};
    for (const key of STYLE_PROP_KEYS) {
      if (this._excludedStyleProps?.has(key)) continue;
      const value = (this as unknown as Record<string, unknown>)[key];
      if (typeof value === 'string' && value !== '') {
        props[key] = value;
      }
    }
    return props as Partial<StyleProps>;
  }

  /**
   * Optional set of style-prop keys to exclude from class resolution.
   * Subclasses that own a prop that collides with a style-prop key (e.g. `gap`, `position`)
   * should populate this in their class body instead of overriding `collectStyleProps`.
   */
  protected _excludedStyleProps?: ReadonlySet<string>;

  protected override willUpdate(_changed: Map<PropertyKey, unknown>): void {
    if (this.collectStyleProps !== KbBaseElement.prototype.collectStyleProps) {
      this._cachedStyleClasses = stylePropsToClasses(this.collectStyleProps());
    } else {
      this._cachedStyleClasses = resolveStyleClasses(
        this as unknown as Record<string, unknown>,
        this._excludedStyleProps,
      );
    }
  }

  protected getStyleClasses(): string {
    return this._cachedStyleClasses;
  }

  protected buildClasses(...additional: ClassInput[]): string {
    return cx(this.getStyleClasses(), ...additional);
  }

  /** Type-safe event emitter. Validates event name and detail type against `KbEventDetailMap`. Always dispatches with `bubbles: true, composed: true`. */
  emit<K extends keyof KbEventDetailMap>(
    ...args: KbEventDetailMap[K] extends undefined
      ? [event: K]
      : undefined extends KbEventDetailMap[K]
        ? [event: K, detail?: KbEventDetailMap[K]]
        : [event: K, detail: KbEventDetailMap[K]]
  ): boolean {
    const [event, detail] = args;
    return this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }
}

// biome-ignore lint/correctness/noUnusedVariables: S must match class generic for declaration merging
export interface KbBaseElement<S extends string = string> extends StyleProps {}

/**
 * Waits for a CSS transition to finish on a child element, then removes the host.
 * Falls back to a timeout if `transitionend` never fires.
 */
export function dismissWithAnimation(host: HTMLElement, selector: string, fallbackMs: number): void {
  if (isServer) return;
  const el = host.querySelector(selector) as HTMLElement | null;
  if (el) {
    const timerId: ReturnType<typeof setTimeout> = setTimeout(() => host.remove(), fallbackMs);
    el.addEventListener(
      'transitionend',
      () => {
        clearTimeout(timerId);
        host.remove();
      },
      { once: true },
    );
  } else {
    host.remove();
  }
}

// Cached at module level - avoids creating a new MediaQueryList on every animation call.
// SSR guard: `window` may be undefined in Node/SSR environments.
const _reducedMotionMQL: MediaQueryList | null =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
let _prefersReducedMotion: boolean = _reducedMotionMQL?.matches ?? false;
_reducedMotionMQL?.addEventListener('change', (e: MediaQueryListEvent) => {
  _prefersReducedMotion = e.matches;
});

/** Returns `true` when the user has requested reduced motion via OS/browser preference. */
export function prefersReducedMotion(): boolean {
  return _prefersReducedMotion;
}

const SPRING_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/** Imperative scale-down on pointer press. Cancels any running animation on the element. No-ops under reduced motion. */
export function springPressDown(el: HTMLElement, scale: number): Animation {
  if (isServer) return undefined as unknown as Animation;
  for (const a of el.getAnimations()) a.cancel();
  const anim = el.animate([{ transform: `scale(${scale})` }], {
    duration: prefersReducedMotion() ? 0 : 100,
    easing: 'ease-out',
    fill: 'forwards',
  });
  anim.finished.then(
    () => {
      anim.commitStyles();
      anim.cancel();
    },
    (_e: unknown) => {
      /* cancelled - no-op */
    },
  );
  return anim;
}

/** Imperative spring-back to scale(1) on pointer release. Uses overshoot easing for tactile feel. Instant under reduced motion. */
export function springPressUp(el: HTMLElement): Animation {
  if (isServer) return undefined as unknown as Animation;
  for (const a of el.getAnimations()) a.cancel();
  const anim = el.animate([{ transform: 'scale(1)' }], {
    duration: prefersReducedMotion() ? 0 : 200,
    easing: SPRING_EASING,
    fill: 'forwards',
  });
  anim.finished.then(
    () => {
      anim.commitStyles();
      anim.cancel();
    },
    (_e: unknown) => {
      /* cancelled - no-op */
    },
  );
  return anim;
}
