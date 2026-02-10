import { LitElement } from 'lit';
import type { PropertyDeclaration } from 'lit';
import { STYLE_PROP_DEFS, STYLE_PROP_KEYS, type StyleProps } from './style-map.js';
import { stylePropsToClasses } from './style-props.js';
import { cx } from '../utils/cx.js';

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

const GENERATED_STYLE_PROPERTIES = buildLitProperties();

/**
 * Base element for all KarbitUI components.
 * Uses Light DOM. Supports Chakra-like style props mapped to Tailwind classes.
 */
export class KbBaseElement extends LitElement {
  /** Host element display value. Override to 'block' for block-level components. */
  static hostDisplay: string = '';
  static override get properties(): LitPropertyMap {
    return {
      ...super.properties,
      ...GENERATED_STYLE_PROPERTIES,
    };
  }

  declare p?: string;
  declare px?: string;
  declare py?: string;
  declare pt?: string;
  declare pr?: string;
  declare pb?: string;
  declare pl?: string;

  declare m?: string;
  declare mx?: string;
  declare my?: string;
  declare mt?: string;
  declare mr?: string;
  declare mb?: string;
  declare ml?: string;

  declare bg?: string;
  declare color?: string;
  declare opacity?: string;

  declare w?: string;
  declare h?: string;
  declare minW?: string;
  declare maxW?: string;
  declare minH?: string;
  declare maxH?: string;

  declare border?: string;
  declare borderColor?: string;
  declare borderTop?: string;
  declare borderRight?: string;
  declare borderBottom?: string;
  declare borderLeft?: string;
  declare rounded?: string;
  declare shadow?: string;

  declare display?: string;
  declare position?: string;
  declare top?: string;
  declare right?: string;
  declare bottom?: string;
  declare left?: string;
  declare zIndex?: string;
  declare overflow?: string;
  declare overflowX?: string;
  declare overflowY?: string;

  declare gap?: string;
  declare gapX?: string;
  declare gapY?: string;
  declare alignItems?: string;
  declare justifyContent?: string;
  declare flexDir?: string;
  declare flexWrap?: string;
  declare flexGrow?: string;
  declare flexShrink?: string;
  declare flex?: string;

  declare gridCols?: string;
  declare gridRows?: string;
  declare colSpan?: string;
  declare rowSpan?: string;

  declare fontSize?: string;
  declare fontWeight?: string;
  declare fontFamily?: string;
  declare textAlign?: string;
  declare lineHeight?: string;
  declare letterSpacing?: string;
  declare textDecoration?: string;
  declare textTransform?: string;

  declare cursor?: string;
  declare userSelect?: string;
  declare pointerEvents?: string;
  declare transition?: string;

  override createRenderRoot(): this {
    return this;
  }

  override connectedCallback(): void {
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
        (n.nodeType === Node.ELEMENT_NODE ||
          (n.nodeType === Node.TEXT_NODE && (n.textContent?.trim() ?? '') !== '')),
    );
  }

  /** Returns previously captured default-slot children, or empty array. */
  protected get defaultSlotContent(): Node[] {
    return this._defaultSlotNodes ?? [];
  }

  /** Returns the named-slot child element, or `null`. */
  protected slotted(name: string): Element | null {
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
    return stylePropsToClasses(this.collectStyleProps());
  }

  protected buildClasses(...additional: (string | undefined | null | false)[]): string {
    return cx(this.getStyleClasses(), ...additional);
  }
}
