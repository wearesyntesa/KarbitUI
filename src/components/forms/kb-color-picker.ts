import { html, isServer, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { KbBaseElement, prefersReducedMotion } from '../../core/base-element.js';
import {
  CLEAR_SIZE,
  FORM_CLEAR_CLASSES,
  FORM_DISABLED_CONTROL,
  type FormVariant,
  SIZE_GAP,
  SIZE_PADDING,
  SIZE_TEXT,
  VARIANT_WRAPPER,
  VARIANT_WRAPPER_INVALID,
} from '../../core/form-tokens.js';
import { renderCloseIcon } from '../../core/icons.js';
import { kbClasses } from '../../core/theme.js';
import type { ComponentSize } from '../../core/types.js';
import { cx } from '../../utils/cx.js';

// ---------------------------------------------------------------------------
// Color conversion helpers (pure functions, no external deps)
// ---------------------------------------------------------------------------

const HASH_PREFIX_RE: RegExp = /^#/;

/** Expand a shorthand hex string to 8 chars (rrggbbaa). */
function expandHex(h: string): string {
  if (h.length === 3) {
    const c0 = h[0] ?? '0';
    const c1 = h[1] ?? '0';
    const c2 = h[2] ?? '0';
    return `${c0}${c0}${c1}${c1}${c2}${c2}ff`;
  }
  if (h.length === 4) {
    const c0 = h[0] ?? '0';
    const c1 = h[1] ?? '0';
    const c2 = h[2] ?? '0';
    const c3 = h[3] ?? '0';
    return `${c0}${c0}${c1}${c1}${c2}${c2}${c3}${c3}`;
  }
  if (h.length === 6) {
    return `${h}ff`;
  }
  return h;
}

/** Parse a hex string (3, 4, 6, or 8 chars after `#`) into RGBA 0-255 / 0-1. */
export function hexToRgba(hex: string): { r: number; g: number; b: number; a: number } {
  const h = expandHex(hex.replace(HASH_PREFIX_RE, ''));
  const n = Number.parseInt(h, 16);
  return {
    r: (n >>> 24) & 0xff,
    g: (n >>> 16) & 0xff,
    b: (n >>> 8) & 0xff,
    a: (n & 0xff) / 255,
  };
}

/** Convert RGBA (r/g/b 0-255, a 0-1) to an 8-char hex string `#rrggbbaa`. */
export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const clamp = (v: number): number => Math.max(0, Math.min(255, Math.round(v)));
  const rr = clamp(r).toString(16).padStart(2, '0');
  const gg = clamp(g).toString(16).padStart(2, '0');
  const bb = clamp(b).toString(16).padStart(2, '0');
  const aa = clamp(a * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${rr}${gg}${bb}${aa}`;
}

/** Convert RGB (0-255) to HSV (h: 0-360, s: 0-1, v: 0-1). */
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) {
      h = ((gn - bn) / d + 6) % 6;
    } else if (max === gn) {
      h = (bn - rn) / d + 2;
    } else {
      h = (rn - gn) / d + 4;
    }
    h *= 60;
  }

  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

/** Convert HSV (h: 0-360, s: 0-1, v: 0-1) to RGB (0-255). */
export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hh >= 0 && hh < 1) {
    r = c;
    g = x;
  } else if (hh >= 1 && hh < 2) {
    r = x;
    g = c;
  } else if (hh >= 2 && hh < 3) {
    g = c;
    b = x;
  } else if (hh >= 3 && hh < 4) {
    g = x;
    b = c;
  } else if (hh >= 4 && hh < 5) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hueToRgbCss(h: number): string {
  const { r, g, b } = hsvToRgb(h, 1, 1);
  return `rgb(${r},${g},${b})`;
}

// ---------------------------------------------------------------------------
// Size-responsive panel tokens
// ---------------------------------------------------------------------------

const SWATCH_SIZE: Record<ComponentSize, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
  xl: 'w-8 h-8',
} as const satisfies Record<ComponentSize, string>;

const PANEL_WIDTH: Record<ComponentSize, string> = {
  xs: 'w-52',
  sm: 'w-56',
  md: 'w-64',
  lg: 'w-72',
  xl: 'w-80',
} as const satisfies Record<ComponentSize, string>;

const SAT_HEIGHT: Record<ComponentSize, string> = {
  xs: 'h-[120px]',
  sm: 'h-[140px]',
  md: 'h-40',
  lg: 'h-[180px]',
  xl: 'h-[200px]',
} as const satisfies Record<ComponentSize, string>;

const BAR_HEIGHT: Record<ComponentSize, string> = {
  xs: 'h-2.5',
  sm: 'h-2.5',
  md: 'h-3',
  lg: 'h-3.5',
  xl: 'h-4',
} as const satisfies Record<ComponentSize, string>;

const PANEL_PADDING: Record<ComponentSize, string> = {
  xs: 'p-2',
  sm: 'p-2.5',
  md: 'p-3',
  lg: 'p-3.5',
  xl: 'p-4',
} as const satisfies Record<ComponentSize, string>;

const PANEL_GAP: Record<ComponentSize, string> = {
  xs: 'gap-1.5',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
} as const satisfies Record<ComponentSize, string>;

const INPUT_HEIGHT: Record<ComponentSize, string> = {
  xs: 'h-6',
  sm: 'h-6',
  md: 'h-7',
  lg: 'h-8',
  xl: 'h-8',
} as const satisfies Record<ComponentSize, string>;

const INPUT_TEXT: Record<ComponentSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-sm',
} as const satisfies Record<ComponentSize, string>;

const PREVIEW_SIZE: Record<ComponentSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-9 h-9',
  xl: 'w-10 h-10',
} as const satisfies Record<ComponentSize, string>;

const CHECKERBOARD_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23ccc'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23ccc'/%3E%3Crect x='8' width='8' height='8' fill='%23fff'/%3E%3Crect y='8' width='8' height='8' fill='%23fff'/%3E%3C/svg%3E\")";

let instanceCounter = 0;

/**
 * Color picker with saturation/brightness area, hue slider, alpha slider,
 * hex/RGB input fields, and optional preset swatches.
 *
 * Uses standard form tokens for consistent sizing and variants across the
 * design system. Panel dimensions scale with the component `size` prop.
 *
 * @fires kb-change - Value changed. Detail: `{ source: 'color-picker', value: string }`.
 * @fires kb-color-change - Color changed. Detail: `{ hex, r, g, b, a }`.
 * @fires kb-clear - Cleared.
 * @fires kb-open - Panel opened.
 * @fires kb-close - Panel closed.
 *
 * @example
 * ```html
 * <kb-color-picker value="#3b82f6ff" clearable></kb-color-picker>
 * ```
 */
export class KbColorPicker extends KbBaseElement {
  static override hostDisplay = 'block' as const;

  /** Current color value as hex (6 or 8 char). @defaultValue '#000000ff' */
  @property({ type: String }) value: string = '#000000ff';
  /** Form field name. */
  @property({ type: String }) name?: string;
  /** Disable interaction. @defaultValue false */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Apply error styling. @defaultValue false */
  @property({ type: Boolean }) invalid: boolean = false;
  /** Show clear button. @defaultValue false */
  @property({ type: Boolean }) clearable: boolean = false;
  /** Preset colors for quick pick. */
  @property({ type: Array }) presets?: string[];
  /** Show alpha channel controls. @defaultValue true */
  @property({ type: Boolean, attribute: 'show-alpha' }) showAlpha: boolean = true;
  /** Placeholder text. @defaultValue 'Pick a color' */
  @property({ type: String }) placeholder: string = 'Pick a color';
  /** Visual variant. @defaultValue 'outline' */
  @property({ type: String }) variant: FormVariant = 'outline';
  /** Component size. @defaultValue 'md' */
  @property({ type: String }) size: ComponentSize = 'md';

  @state() private _open: boolean = false;
  @state() private _h: number = 0;
  @state() private _s: number = 0;
  @state() private _v: number = 0;
  @state() private _a: number = 1;

  private _instanceId: number;
  private readonly _panelId: string;
  private _boundOutsideClick = this._handleOutsideClick.bind(this);
  private _boundKeyDown = this._handleKeyDown.bind(this);
  private _docListenersActive: boolean = false;

  private _dragTarget: 'saturation' | 'hue' | 'alpha' | null = null;
  private _boundDragMove = this._onDragMove.bind(this);
  private _boundDragEnd = this._onDragEnd.bind(this);
  private _suppressValueSync: boolean = false;
  private _cachedCloseIcon: TemplateResult | null = null;

  constructor() {
    super();
    this._instanceId = instanceCounter++;
    this._panelId = `kb-color-panel-${this._instanceId}`;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._syncFromValue();
  }

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    super.willUpdate(changed);
    if (changed.has('value') && !this._suppressValueSync) {
      this._syncFromValue();
    }
    this._suppressValueSync = false;
    if (this._cachedCloseIcon === null || changed.has('size')) {
      this._cachedCloseIcon = renderCloseIcon(CLEAR_SIZE[this.size]);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (isServer) return;
    this._detachDocListeners();
    this._cleanupDrag();
  }

  // -----------------------------------------------------------------------
  // Value sync
  // -----------------------------------------------------------------------

  private _syncFromValue(): void {
    const rgba = hexToRgba(this.value);
    const hsv = rgbToHsv(rgba.r, rgba.g, rgba.b);
    this._h = hsv.h;
    this._s = hsv.s;
    this._v = hsv.v;
    this._a = rgba.a;
  }

  private _updateFromHsva(): void {
    const { r, g, b } = hsvToRgb(this._h, this._s, this._v);
    const hex = rgbaToHex(r, g, b, this._a);
    this._suppressValueSync = true;
    this.value = hex;
    this._emitChange(hex, r, g, b, this._a);
  }

  private _emitChange(hex: string, r: number, g: number, b: number, a: number): void {
    this.emit('kb-change', { source: 'color-picker', value: hex });
    this.emit('kb-color-change', { hex, r, g, b, a });
  }

  // -----------------------------------------------------------------------
  // Open/close with translateY animation
  // -----------------------------------------------------------------------

  private _attachDocListeners(): void {
    if (this._docListenersActive) return;
    document.addEventListener('mousedown', this._boundOutsideClick, true);
    document.addEventListener('keydown', this._boundKeyDown);
    this._docListenersActive = true;
  }

  private _detachDocListeners(): void {
    if (!this._docListenersActive) return;
    document.removeEventListener('mousedown', this._boundOutsideClick, true);
    document.removeEventListener('keydown', this._boundKeyDown);
    this._docListenersActive = false;
  }

  private _openPanel(): void {
    if (this.disabled || this._open) return;
    this._syncFromValue();
    this._attachDocListeners();
    this._open = true;
    this.emit('kb-open');
    this._animatePanel(true);
  }

  private _animatePanel(opening: boolean): void {
    requestAnimationFrame((): void => {
      const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
      if (!panel) return;
      const from = opening ? { opacity: 0, transform: 'translateY(-4px)' } : { opacity: 1, transform: 'translateY(0)' };
      const to = opening ? { opacity: 1, transform: 'translateY(0)' } : { opacity: 0, transform: 'translateY(-4px)' };
      let duration: number;
      if (prefersReducedMotion()) {
        duration = 0;
      } else {
        duration = opening ? 150 : 100;
      }
      panel
        .animate([from, to], {
          duration,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          fill: 'forwards',
        })
        .finished.then(
          (a: Animation): void => {
            a.commitStyles();
            a.cancel();
          },
          (): void => {
            /* cancelled */
          },
        );
    });
  }

  private _closePanel(): void {
    if (!this._open) return;
    const panel = this.querySelector<HTMLElement>(`#${this._panelId}`);
    if (!panel) {
      this._finishClose();
      return;
    }
    let duration: number;
    if (prefersReducedMotion()) {
      duration = 0;
    } else {
      duration = 100;
    }
    panel
      .animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-4px)' },
        ],
        { duration, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
      )
      .finished.then(
        (): void => this._finishClose(),
        (): void => this._finishClose(),
      );
  }

  private _finishClose(): void {
    this._open = false;
    this._detachDocListeners();
    this.emit('kb-close');
  }

  private _togglePanel(): void {
    if (this._open) {
      this._closePanel();
    } else {
      this._openPanel();
    }
  }

  private _handleOutsideClick(e: MouseEvent): void {
    if (!this._open) return;
    if (!this.contains(e.target as Node)) this._closePanel();
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this._open) {
      e.preventDefault();
      this._closePanel();
    }
  }

  // -----------------------------------------------------------------------
  // Pointer drag
  // -----------------------------------------------------------------------

  private _onSaturationPointerDown(e: PointerEvent): void {
    if (this.disabled || isServer) return;
    e.preventDefault();
    this._dragTarget = 'saturation';
    this._updateSaturation(e);
    document.addEventListener('pointermove', this._boundDragMove);
    document.addEventListener('pointerup', this._boundDragEnd);
  }

  private _onHuePointerDown(e: PointerEvent): void {
    if (this.disabled || isServer) return;
    e.preventDefault();
    this._dragTarget = 'hue';
    this._updateHue(e);
    document.addEventListener('pointermove', this._boundDragMove);
    document.addEventListener('pointerup', this._boundDragEnd);
  }

  private _onAlphaPointerDown(e: PointerEvent): void {
    if (this.disabled || isServer) return;
    e.preventDefault();
    this._dragTarget = 'alpha';
    this._updateAlpha(e);
    document.addEventListener('pointermove', this._boundDragMove);
    document.addEventListener('pointerup', this._boundDragEnd);
  }

  private _onDragMove(e: PointerEvent): void {
    if (this._dragTarget === 'saturation') {
      this._updateSaturation(e);
    } else if (this._dragTarget === 'hue') {
      this._updateHue(e);
    } else if (this._dragTarget === 'alpha') {
      this._updateAlpha(e);
    }
  }

  private _onDragEnd(): void {
    this._cleanupDrag();
  }

  private _cleanupDrag(): void {
    this._dragTarget = null;
    document.removeEventListener('pointermove', this._boundDragMove);
    document.removeEventListener('pointerup', this._boundDragEnd);
  }

  private _updateSaturation(e: PointerEvent): void {
    const el = this.querySelector<HTMLElement>('[data-saturation]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    this._s = x;
    this._v = 1 - y;
    this._updateFromHsva();
  }

  private _updateHue(e: PointerEvent): void {
    const el = this.querySelector<HTMLElement>('[data-hue]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._h = x * 360;
    this._updateFromHsva();
  }

  private _updateAlpha(e: PointerEvent): void {
    const el = this.querySelector<HTMLElement>('[data-alpha]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._a = x;
    this._updateFromHsva();
  }

  // -----------------------------------------------------------------------
  // Input handlers
  // -----------------------------------------------------------------------

  private _onHexInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    let val = input.value.trim();
    if (!val.startsWith('#')) {
      val = `#${val}`;
    }
    const stripped = val.replace(HASH_PREFIX_RE, '');
    if (stripped.length === 6 || stripped.length === 8 || stripped.length === 3 || stripped.length === 4) {
      const rgba = hexToRgba(val);
      const hsv = rgbToHsv(rgba.r, rgba.g, rgba.b);
      this._h = hsv.h;
      this._s = hsv.s;
      this._v = hsv.v;
      this._a = rgba.a;
      this._updateFromHsva();
    }
  }

  private _onRgbInput(channel: 'r' | 'g' | 'b', e: Event): void {
    const input = e.target as HTMLInputElement;
    const num = Math.max(0, Math.min(255, Number.parseInt(input.value, 10) || 0));
    const { r, g, b } = hsvToRgb(this._h, this._s, this._v);
    let nr = r;
    let ng = g;
    let nb = b;
    if (channel === 'r') {
      nr = num;
    } else if (channel === 'g') {
      ng = num;
    } else {
      nb = num;
    }
    const hsv = rgbToHsv(nr, ng, nb);
    this._h = hsv.h;
    this._s = hsv.s;
    this._v = hsv.v;
    this._updateFromHsva();
  }

  private _onAlphaInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const num = Math.max(0, Math.min(100, Number.parseInt(input.value, 10) || 0));
    this._a = num / 100;
    this._updateFromHsva();
  }

  private _onPresetClick(hex: string): void {
    const rgba = hexToRgba(hex);
    const hsv = rgbToHsv(rgba.r, rgba.g, rgba.b);
    this._h = hsv.h;
    this._s = hsv.s;
    this._v = hsv.v;
    this._a = rgba.a;
    this._updateFromHsva();
  }

  private _handleClear(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.value = '#000000ff';
    this._syncFromValue();
    this.emit('kb-change', { source: 'color-picker', value: '#000000ff' });
    this.emit('kb-clear');
  }

  private _preventMouseDown(e: Event): void {
    e.preventDefault();
  }

  // -----------------------------------------------------------------------
  // Computed
  // -----------------------------------------------------------------------

  private _currentRgb(): { r: number; g: number; b: number } {
    return hsvToRgb(this._h, this._s, this._v);
  }

  private _currentHexDisplay(): string {
    const { r, g, b } = this._currentRgb();
    if (this.showAlpha) {
      return rgbaToHex(r, g, b, this._a);
    }
    return rgbaToHex(r, g, b, 1).slice(0, 7);
  }

  private _currentCssColor(): string {
    const { r, g, b } = this._currentRgb();
    return `rgba(${r},${g},${b},${this._a})`;
  }

  // -----------------------------------------------------------------------
  // Render helpers
  // -----------------------------------------------------------------------

  private _renderSaturationArea(): TemplateResult {
    const hueColor = hueToRgbCss(this._h);
    const indicatorLeft = `${this._s * 100}%`;
    const indicatorTop = `${(1 - this._v) * 100}%`;

    return html`
      <div
        data-saturation
        class="relative w-full cursor-crosshair select-none ${SAT_HEIGHT[this.size]}"
        style="background:linear-gradient(to bottom,transparent,#000),linear-gradient(to right,#fff,${hueColor})"
        @pointerdown=${this._onSaturationPointerDown}
      >
        <div
          class="absolute pointer-events-none border-2 border-white"
          style="width:10px;height:10px;transform:translate(-50%,-50%);left:${indicatorLeft};top:${indicatorTop};outline:1px solid rgba(0,0,0,0.4)"
        ></div>
      </div>
    `;
  }

  private _renderHueBar(): TemplateResult {
    const indicatorLeft = `${(this._h / 360) * 100}%`;

    return html`
      <div
        data-hue
        class="relative w-full cursor-pointer select-none ${BAR_HEIGHT[this.size]}"
        style="background:linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)"
        @pointerdown=${this._onHuePointerDown}
      >
        <div
          class="absolute top-0 h-full border-2 border-white pointer-events-none"
          style="width:6px;transform:translateX(-50%);left:${indicatorLeft};outline:1px solid rgba(0,0,0,0.4)"
        ></div>
      </div>
    `;
  }

  private _renderAlphaBar(): TemplateResult {
    const { r, g, b } = this._currentRgb();
    const indicatorLeft = `${this._a * 100}%`;

    return html`
      <div
        data-alpha
        class="relative w-full cursor-pointer select-none ${BAR_HEIGHT[this.size]}"
        style="background-image:linear-gradient(to right,rgba(${r},${g},${b},0),rgb(${r},${g},${b})),${CHECKERBOARD_BG};background-size:100% 100%,16px 16px"
        @pointerdown=${this._onAlphaPointerDown}
      >
        <div
          class="absolute top-0 h-full border-2 border-white pointer-events-none"
          style="width:6px;transform:translateX(-50%);left:${indicatorLeft};outline:1px solid rgba(0,0,0,0.4)"
        ></div>
      </div>
    `;
  }

  private _renderInputFields(): TemplateResult {
    const { r, g, b } = this._currentRgb();
    const alphaPercent = Math.round(this._a * 100);
    const hexDisplay = this._currentHexDisplay();
    const s = this.size;

    const inputBase: string = cx(
      'w-full border font-sans tabular-nums text-center',
      INPUT_HEIGHT[s],
      INPUT_TEXT[s],
      kbClasses.borderColor,
      kbClasses.surface,
      kbClasses.textPrimary,
      kbClasses.transitionColors,
      'focus:outline-none focus:border-blue-500 dark:focus:border-blue-400',
      'px-1',
    );

    const labelClass: string = cx('text-center block', INPUT_TEXT[s], kbClasses.textMuted, 'mt-0.5 select-none');

    return html`
      <div class="flex gap-1.5 items-start">
        <div class="flex-1 min-w-0">
          <input
            type="text"
            class="${inputBase}"
            .value=${hexDisplay}
            @input=${this._onHexInput}
            aria-label="Hex color"
          />
          <span class="${labelClass}">Hex</span>
        </div>
        <div class="w-9">
          <input
            type="number"
            class="${inputBase}"
            .value=${String(r)}
            min="0"
            max="255"
            @input=${(e: Event): void => this._onRgbInput('r', e)}
            aria-label="Red"
          />
          <span class="${labelClass}">R</span>
        </div>
        <div class="w-9">
          <input
            type="number"
            class="${inputBase}"
            .value=${String(g)}
            min="0"
            max="255"
            @input=${(e: Event): void => this._onRgbInput('g', e)}
            aria-label="Green"
          />
          <span class="${labelClass}">G</span>
        </div>
        <div class="w-9">
          <input
            type="number"
            class="${inputBase}"
            .value=${String(b)}
            min="0"
            max="255"
            @input=${(e: Event): void => this._onRgbInput('b', e)}
            aria-label="Blue"
          />
          <span class="${labelClass}">B</span>
        </div>
        ${this._renderAlphaInputField(alphaPercent, inputBase, labelClass)}
      </div>
    `;
  }

  private _renderAlphaInputField(
    alphaPercent: number,
    inputBase: string,
    labelClass: string,
  ): TemplateResult | typeof nothing {
    if (!this.showAlpha) return nothing;
    return html`
      <div class="w-9">
        <input
          type="number"
          class="${inputBase}"
          .value=${String(alphaPercent)}
          min="0"
          max="100"
          @input=${this._onAlphaInput}
          aria-label="Alpha"
        />
        <span class="${labelClass}">A</span>
      </div>
    `;
  }

  private _renderPresets(): TemplateResult | typeof nothing {
    if (!this.presets || this.presets.length === 0) return nothing;

    return html`
      <div class="flex flex-wrap gap-1.5 pt-2 ${kbClasses.borderTop}">
        ${this.presets.map(
          (color: string): TemplateResult => html`
            <button
              type="button"
              class="w-5 h-5 border ${kbClasses.borderColor} cursor-pointer ${kbClasses.transitionColors} hover:scale-110 transition-transform"
              style="background:${color}"
              @click=${(): void => this._onPresetClick(color)}
              aria-label="Select color ${color}"
            ></button>
          `,
        )}
      </div>
    `;
  }

  private _renderPanel(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const s = this.size;

    const panelClasses: string = cx(
      'absolute z-50 left-0 top-full mt-1 max-w-[calc(100vw-2rem)]',
      'flex flex-col',
      PANEL_WIDTH[s],
      PANEL_PADDING[s],
      PANEL_GAP[s],
      kbClasses.surface,
      kbClasses.border,
    );

    const cssColor = this._currentCssColor();

    return html`
      <div
        id=${this._panelId}
        class="${panelClasses}"
        @mousedown=${this._preventMouseDown}
        style="opacity:0"
      >
        ${this._renderSaturationArea()}
        ${this._renderHueBar()}
        ${this.showAlpha ? this._renderAlphaBar() : nothing}
        <div class="flex items-center gap-2 pt-1.5 ${kbClasses.borderTop}">
          <div
            class="shrink-0 border ${kbClasses.borderColor} ${PREVIEW_SIZE[s]}"
            style="background-image:linear-gradient(${cssColor},${cssColor}),${CHECKERBOARD_BG};background-size:100% 100%,16px 16px"
          ></div>
          <div class="flex-1 min-w-0">
            ${this._renderInputFields()}
          </div>
        </div>
        ${this._renderPresets()}
      </div>
    `;
  }

  private _renderTriggerContent(): TemplateResult {
    const hasValue = this.value !== '#000000ff';
    const textClass: string = cx(
      'flex-1 truncate select-none font-sans tabular-nums text-left',
      SIZE_TEXT[this.size],
      hasValue ? kbClasses.textPrimary : kbClasses.textMuted,
    );

    const chevronClass: string = cx(
      'shrink-0 flex items-center pointer-events-none select-none',
      kbClasses.textMuted,
      kbClasses.transitionColors,
      this._open ? 'rotate-180' : '',
      'transition-transform duration-150',
    );

    return html`
      <div
        class="shrink-0 border ${kbClasses.borderColor} ${SWATCH_SIZE[this.size]}"
        style="background-image:linear-gradient(${this._currentCssColor()},${this._currentCssColor()}),${CHECKERBOARD_BG};background-size:100% 100%,16px 16px"
      ></div>
      <span class="${textClass}">${this._currentHexDisplay()}</span>
      <span class="${chevronClass}">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="m6 9 6 6 6-6"/></svg>
      </span>
    `;
  }

  override render(): TemplateResult {
    const s = this.size;
    const isFlushed = this.variant === 'flushed';
    const wrapperBorder = this.invalid ? VARIANT_WRAPPER_INVALID[this.variant] : VARIANT_WRAPPER[this.variant];
    const showClear = this.clearable && this.value !== '#000000ff' && !this.disabled;

    const outerClasses = this.buildClasses(
      'relative flex items-stretch w-full font-sans',
      kbClasses.transitionColors,
      isFlushed ? '' : wrapperBorder,
      this.disabled ? kbClasses.disabled : '',
      this.disabled ? FORM_DISABLED_CONTROL : '',
    );

    const innerClasses: string = cx(
      'flex items-center flex-1 cursor-pointer',
      SIZE_PADDING[s],
      SIZE_GAP[s],
      isFlushed ? wrapperBorder : '',
    );

    return html`
      <div class=${outerClasses}>
        <div
          class=${innerClasses}
          role="combobox"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-haspopup="dialog"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-controls=${this._open ? this._panelId : nothing}
          aria-invalid=${this.invalid ? 'true' : 'false'}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          aria-label=${this.placeholder}
          @click=${this._togglePanel}
          @keydown=${this._handleTriggerKeyDown}
        >
          ${this._renderTriggerContent()}
          ${showClear ? html`<button class="${FORM_CLEAR_CLASSES}" @click=${this._handleClear} type="button" aria-label="Clear color" tabindex="-1">${this._cachedCloseIcon}</button>` : nothing}
        </div>
        ${this._renderPanel()}
        ${this.name ? html`<input type="hidden" name=${this.name} .value=${this.value} />` : nothing}
      </div>
    `;
  }

  private _handleTriggerKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this._open) this._openPanel();
    }
    if (e.key === 'Escape' && this._open) {
      e.preventDefault();
      this._closePanel();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-color-picker': KbColorPicker;
  }
}
