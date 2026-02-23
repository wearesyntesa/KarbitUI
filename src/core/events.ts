import type { BreadcrumbItem, SortDirection } from './types.js';

export interface KbChangeValueDetail {
  readonly source: 'input' | 'textarea' | 'select' | 'radio-group';
  readonly value: string;
}

/** Narrowed `KbChangeValueDetail` for a specific source. */
export type KbChangeValueDetailFor<S extends KbChangeValueDetail['source']> = Omit<KbChangeValueDetail, 'source'> & {
  readonly source: S;
};

export interface KbChangeCheckedDetail {
  readonly source: 'switch';
  readonly checked: boolean;
}

export interface KbChangeCheckboxDetail {
  readonly source: 'checkbox';
  readonly checked: boolean;
  readonly value: string;
}

export interface KbChangeRadioDetail {
  readonly source: 'radio';
  readonly value: string;
  readonly checked: true;
}

export interface KbChangeGroupDetail {
  readonly source: 'checkbox-group';
  readonly values: readonly string[];
}

export interface KbInputDetail {
  readonly value: string;
}

export interface KbClickLinkDetail {
  readonly href: string;
}

export interface KbToggleDetail {
  readonly open: boolean;
}

export interface KbSortDetail {
  readonly column: number;
  readonly direction: SortDirection;
}

export interface KbRowClickDetail {
  readonly index: number;
  readonly row: HTMLTableRowElement;
}

export interface KbTabChangeDetail {
  readonly index: number;
  readonly previousIndex: number;
}

export interface KbNavigateDetail {
  readonly index: number;
  readonly item: BreadcrumbItem;
}

export interface KbReorderDetail {
  readonly order: readonly string[];
}

/** Optional `source` field for zero-detail lifecycle events. */
export interface KbSourceDetail {
  readonly source?: string;
}

/** Detail for `kb-drag-start` / `kb-drag-end` events fired by `kb-tag-group`. */
export interface KbDragDetail {
  readonly value: string;
}

/** Discriminated union of all `kb-change` event details. Narrow via `detail.source`. */
export type KbChangeDetail =
  | KbChangeValueDetail
  | KbChangeCheckedDetail
  | KbChangeCheckboxDetail
  | KbChangeRadioDetail
  | KbChangeGroupDetail;

/** All valid `source` values across `kb-change` event details. Derived from `KbChangeDetail`. */
export type KbChangeSource = KbChangeDetail['source'];

/** Type guard to narrow a {@link KbChangeDetail} to the detail type for a specific source. */
export function narrowKbChange<S extends KbChangeSource>(
  detail: KbChangeDetail,
  source: S,
): detail is Extract<KbChangeDetail, { source: S }> {
  return detail.source === source;
}

export interface KbEventDetailMap {
  'kb-change': KbChangeDetail;
  'kb-input': KbInputDetail;
  /** Generic click for interactive elements without a URL (cards, tags, badges, list-items). */
  'kb-click': undefined;
  /** Link-specific click carrying the href. **Breaking**: previously merged into `kb-click`. */
  'kb-link-click': KbClickLinkDetail;
  'kb-close': KbSourceDetail | undefined;
  'kb-open': KbSourceDetail | undefined;
  'kb-focus': KbSourceDetail | undefined;
  'kb-blur': KbSourceDetail | undefined;
  'kb-clear': KbSourceDetail | undefined;
  'kb-toggle': KbToggleDetail;
  'kb-sort': KbSortDetail;
  'kb-row-click': KbRowClickDetail;
  'kb-tab-change': KbTabChangeDetail;
  'kb-navigate': KbNavigateDetail;
  'kb-reorder': KbReorderDetail;
  'kb-drag-start': KbDragDetail;
  'kb-drag-end': KbDragDetail;
}

/** Union of all KarbitUI event names. */
export type KbEventName = keyof KbEventDetailMap;

export type KbCustomEvent<K extends keyof KbEventDetailMap> = KbEventDetailMap[K] extends undefined
  ? CustomEvent<undefined>
  : CustomEvent<KbEventDetailMap[K]>;

/** Convenience handler type for KarbitUI events. */
export type KbEventHandler<K extends keyof KbEventDetailMap> = (event: KbCustomEvent<K>) => void;

type KbEventMap = {
  [K in keyof KbEventDetailMap]: KbEventDetailMap[K] extends undefined
    ? CustomEvent<undefined>
    : CustomEvent<KbEventDetailMap[K]>;
};

declare global {
  interface HTMLElementEventMap extends KbEventMap {}
}
