import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbMenuItem } from '../../components/overlay/kb-menu-item.define.js';
import type { KbSelectDetail } from '../../core/events.js';

export const MenuItem = createComponent({
  react: React,
  tagName: 'kb-menu-item',
  elementClass: KbMenuItem,
  events: {
    onKbSelect: 'kb-select' as EventName<CustomEvent<KbSelectDetail>>,
  },
});

export type MenuItemProps = React.ComponentProps<typeof MenuItem>;
export type { KbMenuItem };
