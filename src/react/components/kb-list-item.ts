import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbListItem } from '../../components/data-display/kb-list-item.js';

export const ListItem = createComponent({
  react: React,
  tagName: 'kb-list-item',
  elementClass: KbListItem,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
  },
});

export type ListItemProps = React.ComponentProps<typeof ListItem>;
export type { KbListItem };
