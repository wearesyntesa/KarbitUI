import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbLink } from '../../components/navigation/kb-link.js';
import type { KbClickLinkDetail } from '../../core/events.js';

export const Link = createComponent({
  react: React,
  tagName: 'kb-link',
  elementClass: KbLink,
  events: {
    onKbLinkClick: 'kb-link-click' as EventName<CustomEvent<KbClickLinkDetail>>,
  },
});

export type LinkProps = React.ComponentProps<typeof Link>;
export type { KbLink };
export type { LinkVariant } from '../../components/navigation/kb-link.js';
