import { noChange } from 'lit';
import {
  directive,
  Directive,
  type ElementPart,
  type PartInfo,
  PartType,
} from 'lit/directive.js';

type ArgsRecord = Record<string, unknown>;

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

class SpreadAttrsDirective extends Directive {
  private prev = new Set<string>();

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('spreadAttrs can only be used on elements');
    }
  }

  override render(_attrs: ArgsRecord): typeof noChange {
    return noChange;
  }

  override update(part: ElementPart, [attrs]: [ArgsRecord]): typeof noChange {
    const el = part.element;
    const current = new Set<string>();

    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith('_')) continue;
      const attr = camelToKebab(k);
      current.add(attr);

      if (v === undefined || v === null || v === false || v === '') {
        el.removeAttribute(attr);
      } else if (v === true) {
        el.setAttribute(attr, '');
      } else {
        el.setAttribute(attr, String(v));
      }
    }

    for (const attr of this.prev) {
      if (!current.has(attr)) {
        el.removeAttribute(attr);
      }
    }

    this.prev = current;
    return noChange;
  }
}

/** Spreads an args record as HTML attributes on the host element. */
export const spreadAttrs = directive(SpreadAttrsDirective);
