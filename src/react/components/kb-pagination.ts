import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbPagination } from '../../components/navigation/kb-pagination.define.js';
import type { KbPageChangeDetail } from '../../core/events.js';

export const Pagination = createComponent({
  react: React,
  tagName: 'kb-pagination',
  elementClass: KbPagination,
  events: {
    onKbPageChange: 'kb-page-change' as EventName<CustomEvent<KbPageChangeDetail>>,
  },
});

export type PaginationProps = React.ComponentProps<typeof Pagination>;
export type { KbPagination };
export type { PaginationSize } from '../../components/navigation/kb-pagination.js';
