import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbBadge } from '../../components/feedback/kb-badge.js';

export const Badge = createComponent({
  react: React,
  tagName: 'kb-badge',
  elementClass: KbBadge,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type BadgeProps = React.ComponentProps<typeof Badge>;
export type { KbBadge };
export type { BadgeSize, BadgeVariant } from '../../components/feedback/kb-badge.js';
