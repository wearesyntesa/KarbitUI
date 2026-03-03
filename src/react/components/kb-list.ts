import { createComponent } from '@lit/react';
import React from 'react';
import { KbList } from '../../components/data-display/kb-list.define.js';

export const List = createComponent({
  react: React,
  tagName: 'kb-list',
  elementClass: KbList,
});

export type ListProps = React.ComponentProps<typeof List>;
export type { KbList };
export type { ListSpacing, ListVariant } from '../../components/data-display/kb-list.js';
