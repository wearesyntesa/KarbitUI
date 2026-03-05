import type { BreadcrumbItem, SortDirection } from './types.js';

export interface KbChangeValueDetail {
  readonly source:
    | 'input'
    | 'textarea'
    | 'select'
    | 'radio-group'
    | 'number-input'
    | 'slider'
    | 'pin-input'
    | 'date-picker'
    | 'time-picker'
    | 'combobox'
    | 'rating'
    | 'segment'
    | 'color-picker'
    | 'editable';
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
  readonly source: 'checkbox-group' | 'tags-input';
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

/** Detail for `kb-page-change` events fired by `kb-pagination`. */
export interface KbPageChangeDetail {
  readonly page: number;
}

/** Detail for `kb-complete` events fired by `kb-pin-input` when all digits are filled. */
export interface KbCompleteDetail {
  readonly value: string;
}

/** Detail for `kb-select` events fired by `kb-dropdown-menu` when a menu item is selected. */
export interface KbSelectDetail {
  readonly value: string;
}

/** Detail for `kb-step-click` events fired by `kb-steps` when a completed step is clicked. */
export interface KbStepClickDetail {
  readonly index: number;
}

/** Detail for `kb-tag-add` events fired by `kb-tags-input` when a tag is added. */
export interface KbTagAddDetail {
  readonly value: string;
}

/** Detail for `kb-tag-remove` events fired by `kb-tags-input` when a tag is removed. */
export interface KbTagRemoveDetail {
  readonly value: string;
  readonly index: number;
}

/** Detail for `kb-file-select` events fired by `kb-file-upload` when files are selected. */
export interface KbFileSelectDetail {
  readonly files: readonly File[];
}

/** Detail for `kb-file-remove` events fired by `kb-file-upload` when a file is removed. */
export interface KbFileRemoveDetail {
  readonly name: string;
  readonly index: number;
}

/** Detail for `kb-rating-hover` events fired by `kb-rating` during hover interaction. */
export interface KbRatingHoverDetail {
  readonly value: number;
}

/** Detail for `kb-color-change` events fired by `kb-color-picker` when the color changes. */
export interface KbColorChangeDetail {
  readonly hex: string;
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

/** Detail for `kb-node-toggle` events fired by `kb-tree-view` when a node is expanded or collapsed. */
export interface KbNodeToggleDetail {
  readonly id: string;
  readonly expanded: boolean;
}

/** Detail for `kb-node-select` events fired by `kb-tree-view` when a node is selected. */
export interface KbNodeSelectDetail {
  readonly id: string;
  readonly label: string;
}

/** Detail for `kb-slide-change` events fired by `kb-carousel` when the active slide changes. */
export interface KbSlideChangeDetail {
  readonly index: number;
  readonly previousIndex: number;
}

/** Detail for `kb-timeline-item-click` events fired by `kb-timeline` when an item is clicked. */
export interface KbTimelineItemClickDetail {
  readonly index: number;
  readonly id: string;
}

/** Detail for `kb-copy` events fired by `kb-clipboard` after copying to clipboard. */
export interface KbCopyDetail {
  readonly value: string;
  readonly success: boolean;
}

/** Detail for `kb-edit-submit` events fired by `kb-editable` when editing is confirmed. */
export interface KbEditSubmitDetail {
  readonly value: string;
  readonly previousValue: string;
}

/** Detail for `kb-edit-cancel` events fired by `kb-editable` when editing is cancelled. */
export interface KbEditCancelDetail {
  readonly value: string;
}

/** Detail for `kb-confirm` events fired by `kb-alert-dialog` when the confirm action is triggered. */
export interface KbConfirmDetail {
  readonly source: 'alert-dialog';
}

/** Detail for `kb-cancel` events fired by `kb-alert-dialog` when the cancel action is triggered. */
export interface KbCancelDetail {
  readonly source: 'alert-dialog';
}

/** Detail for `kb-scroll` events fired by `kb-scroll-area` on scroll position changes. */
export interface KbScrollDetail {
  readonly scrollTop: number;
  readonly scrollLeft: number;
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
  'kb-page-change': KbPageChangeDetail;
  'kb-complete': KbCompleteDetail;
  'kb-select': KbSelectDetail;
  'kb-step-click': KbStepClickDetail;
  'kb-tag-add': KbTagAddDetail;
  'kb-tag-remove': KbTagRemoveDetail;
  'kb-file-select': KbFileSelectDetail;
  'kb-file-remove': KbFileRemoveDetail;
  'kb-rating-hover': KbRatingHoverDetail;
  'kb-color-change': KbColorChangeDetail;
  'kb-node-toggle': KbNodeToggleDetail;
  'kb-node-select': KbNodeSelectDetail;
  'kb-slide-change': KbSlideChangeDetail;
  'kb-timeline-item-click': KbTimelineItemClickDetail;
  'kb-copy': KbCopyDetail;
  'kb-edit-submit': KbEditSubmitDetail;
  'kb-edit-cancel': KbEditCancelDetail;
  'kb-confirm': KbConfirmDetail;
  'kb-cancel': KbCancelDetail;
  'kb-scroll': KbScrollDetail;
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
