import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbCollapsible } from '../../components/data-display/kb-collapsible.define.js';
import type { KbToggleDetail } from '../../core/events.js';

export const Collapsible = createComponent({
  react: React,
  tagName: 'kb-collapsible',
  elementClass: KbCollapsible,
  events: {
    onKbToggle: 'kb-toggle' as EventName<CustomEvent<KbToggleDetail>>,
  },
});

export type CollapsibleProps = React.ComponentProps<typeof Collapsible>;
export type { KbCollapsible };
