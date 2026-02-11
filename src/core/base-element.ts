import type { PropertyDeclaration } from 'lit';
import { LitElement } from 'lit';
import { type ClassInput, cx } from '../utils/cx.js';
import type { KbEventDetailMap } from './events.js';
import { STYLE_PROP_DEFS, STYLE_PROP_KEYS, type StyleProps } from './style-map.js';
import { resolveStyleClasses, stylePropsToClasses } from './style-props.js';

type LitPropertyMap = Record<string, PropertyDeclaration>;

function buildLitProperties(): LitPropertyMap {
  const props: LitPropertyMap = {};
  for (const key of STYLE_PROP_KEYS) {
    const def = STYLE_PROP_DEFS[key];
    props[key] = {
      type: String,
      reflect: true,
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
// biome-ignore lint/suspicious/noUnsafeDeclarationMerging: intentional Lit pattern — declaration merging adds StyleProps to the class
export class KbBaseElement<S extends string = string> extends LitElement {
  /** Host element display value. Override to 'block' for block-level components. */
  static hostDisplay: HostDisplay = '';
  static override get properties(): LitPropertyMap {
    return {
      ...LitElement.properties,
      ...GENERATED_STYLE_PROPERTIES,
    };
  }

  override createRenderRoot(): this {
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

  private _defaultSlotNodes: Node[] | undefined;

  /** Capture default-slot children (no `slot` attribute) before Lit renders. Call before `super.connectedCallback()`. Only captures once — subsequent calls (e.g. after DOM move) are no-ops since Lit owns the DOM after first render. */
  protected captureDefaultSlotContent(): void {
    if (this._defaultSlotNodes !== undefined) return;
    this._defaultSlotNodes = Array.from(this.childNodes).filter(
      (n) =>
        !(n instanceof Element && n.hasAttribute('slot')) &&
        (n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && (n.textContent?.trim() ?? '') !== '')),
    );
  }

  /** Returns previously captured default-slot children, or empty array. */
  protected get defaultSlotContent(): Node[] {
    return this._defaultSlotNodes ?? [];
  }

  /** Returns the named-slot child element, or `null`. */
  protected slotted(name: S): Element | null {
    return this.querySelector(`[slot="${name}"]`);
  }

  protected collectStyleProps(): Partial<StyleProps> {
    const props: Record<string, string> = {};
    for (const key of STYLE_PROP_KEYS) {
      const value = (this as unknown as Record<string, unknown>)[key];
      if (typeof value === 'string' && value !== '') {
        props[key] = value;
      }
    }
    return props as Partial<StyleProps>;
  }

  protected getStyleClasses(): string {
    // Subclasses that override collectStyleProps (to exclude owned props) fall
    // back to the two-step path. The base case uses the single-pass resolver
    // that builds the cache key and maps classes in one iteration.
    if (this.collectStyleProps !== KbBaseElement.prototype.collectStyleProps) {
      return stylePropsToClasses(this.collectStyleProps());
    }
    return resolveStyleClasses(this as unknown as Record<string, unknown>);
  }

  protected buildClasses(...additional: ClassInput[]): string {
    return cx(this.getStyleClasses(), ...additional);
  }

  /** Type-safe event emitter. Validates event name and detail type against `KbEventDetailMap`. Always dispatches with `bubbles: true, composed: true`. */
  protected emit<K extends keyof KbEventDetailMap>(
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
  const el = host.querySelector(selector) as HTMLElement | null;
  if (el) {
    el.addEventListener('transitionend', () => host.remove(), { once: true });
    setTimeout(() => host.remove(), fallbackMs);
  } else {
    host.remove();
  }
}
