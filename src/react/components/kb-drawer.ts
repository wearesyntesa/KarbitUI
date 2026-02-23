import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbDrawer } from '../../components/overlay/kb-drawer.js';

export const Drawer = createComponent({
  react: React,
  tagName: 'kb-drawer',
  elementClass: KbDrawer,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type DrawerProps = React.ComponentProps<typeof Drawer>;
export type { KbDrawer };
export type { DrawerPlacement } from '../../components/overlay/kb-drawer.js';
