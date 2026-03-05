import { createComponent } from '@lit/react';
import React from 'react';
import { KbDataList } from '../../components/data-display/kb-data-list.define.js';

export const DataList = createComponent({
  react: React,
  tagName: 'kb-data-list',
  elementClass: KbDataList,
});

export type DataListProps = React.ComponentProps<typeof DataList>;
export type { KbDataList };
export type { DataListItem, DataListOrientation } from '../../components/data-display/kb-data-list.js';
