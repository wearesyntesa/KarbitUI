import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbContextMenu } from '../../components/overlay/kb-context-menu.define.js';
import type { KbSelectDetail } from '../../core/events.js';

export const ContextMenu = createComponent({
  react: React,
  tagName: 'kb-context-menu',
  elementClass: KbContextMenu,
  events: {
    onKbSelect: 'kb-select' as EventName<CustomEvent<KbSelectDetail>>,
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type ContextMenuProps = React.ComponentProps<typeof ContextMenu>;
export type { KbContextMenu };
