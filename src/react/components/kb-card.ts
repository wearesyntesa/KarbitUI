import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbCard } from '../../components/data-display/kb-card.define.js';

export const Card = createComponent({
  react: React,
  tagName: 'kb-card',
  elementClass: KbCard,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
  },
});

export type CardProps = React.ComponentProps<typeof Card>;
export type { KbCard };
export type { CardVariant } from '../../components/data-display/kb-card.js';
