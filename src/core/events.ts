import type { BreadcrumbItem } from '../components/navigation/kb-breadcrumb.js';
import type { SortDirection } from '../components/data-display/kb-table.js';

// -- kb-change source discriminant --

export type KbChangeSource =
  | 'input' | 'textarea' | 'select'
  | 'checkbox' | 'radio' | 'switch'
  | 'checkbox-group' | 'radio-group';

// -- Individual event detail interfaces --

export interface KbChangeValueDetail {
  readonly source: 'input' | 'textarea' | 'select' | 'radio-group';
  readonly value: string;
}

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
  readonly values: string[];
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
  readonly order: string[];
}

// -- Aggregate event-name → detail map --

export interface KbEventDetailMap {
  'kb-change': KbChangeValueDetail | KbChangeCheckedDetail | KbChangeCheckboxDetail | KbChangeRadioDetail | KbChangeGroupDetail;
  'kb-input': KbInputDetail;
  'kb-click': KbClickLinkDetail | undefined;
  'kb-close': undefined;
  'kb-open': undefined;
  'kb-focus': undefined;
  'kb-blur': undefined;
  'kb-clear': undefined;
  'kb-toggle': KbToggleDetail;
  'kb-sort': KbSortDetail;
  'kb-row-click': KbRowClickDetail;
  'kb-tab-change': KbTabChangeDetail;
  'kb-navigate': KbNavigateDetail;
  'kb-reorder': KbReorderDetail;
}

// -- Typed CustomEvent helper --

export type KbCustomEvent<K extends keyof KbEventDetailMap> =
  KbEventDetailMap[K] extends undefined
    ? CustomEvent<undefined>
    : CustomEvent<KbEventDetailMap[K]>;

// -- Global event map augmentation for addEventListener type safety --

type KbEventMap = {
  [K in keyof KbEventDetailMap]:
    KbEventDetailMap[K] extends undefined
      ? CustomEvent<undefined>
      : CustomEvent<KbEventDetailMap[K]>;
};

declare global {
  interface HTMLElementEventMap extends KbEventMap {}
}
