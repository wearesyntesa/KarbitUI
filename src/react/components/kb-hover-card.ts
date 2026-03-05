import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbHoverCard } from '../../components/overlay/kb-hover-card.define.js';

export const HoverCard = createComponent({
  react: React,
  tagName: 'kb-hover-card',
  elementClass: KbHoverCard,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type HoverCardProps = React.ComponentProps<typeof HoverCard>;
export type { KbHoverCard };
export type { HoverCardPlacement, HoverCardSize } from '../../components/overlay/kb-hover-card.js';
