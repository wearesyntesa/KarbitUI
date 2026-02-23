import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTable } from '../../components/data-display/kb-table.js';
import type { KbRowClickDetail, KbSortDetail } from '../../core/events.js';

export const Table = createComponent({
  react: React,
  tagName: 'kb-table',
  elementClass: KbTable,
  events: {
    onKbRowClick: 'kb-row-click' as EventName<CustomEvent<KbRowClickDetail>>,
    onKbSort: 'kb-sort' as EventName<CustomEvent<KbSortDetail>>,
  },
});

export type TableProps = React.ComponentProps<typeof Table>;
export type { KbTable };
export type { TableSize, TableVariant } from '../../components/data-display/kb-table.js';
