import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbDropdownMenu } from '../../components/overlay/kb-dropdown-menu.define.js';
import type { KbSelectDetail } from '../../core/events.js';

export const DropdownMenu = createComponent({
  react: React,
  tagName: 'kb-dropdown-menu',
  elementClass: KbDropdownMenu,
  events: {
    onKbSelect: 'kb-select' as EventName<CustomEvent<KbSelectDetail>>,
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type DropdownMenuProps = React.ComponentProps<typeof DropdownMenu>;
export type { KbDropdownMenu };
