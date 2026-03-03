import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbPopover } from '../../components/overlay/kb-popover.define.js';

export const Popover = createComponent({
  react: React,
  tagName: 'kb-popover',
  elementClass: KbPopover,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type PopoverProps = React.ComponentProps<typeof Popover>;
export type { KbPopover };
export type { PopoverPlacement, PopoverSize, PopoverTrigger } from '../../components/overlay/kb-popover.js';
