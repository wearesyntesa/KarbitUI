import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbAccordion } from '../../components/data-display/kb-accordion.js';
import type { KbToggleDetail } from '../../core/events.js';

export const Accordion = createComponent({
  react: React,
  tagName: 'kb-accordion',
  elementClass: KbAccordion,
  events: {
    onKbToggle: 'kb-toggle' as EventName<CustomEvent<KbToggleDetail>>,
  },
});

export type AccordionProps = React.ComponentProps<typeof Accordion>;
export type { KbAccordion };
