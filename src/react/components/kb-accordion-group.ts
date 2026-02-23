import { createComponent } from '@lit/react';
import React from 'react';
import { KbAccordionGroup } from '../../components/data-display/kb-accordion-group.js';

export const AccordionGroup = createComponent({
  react: React,
  tagName: 'kb-accordion-group',
  elementClass: KbAccordionGroup,
});

export type AccordionGroupProps = React.ComponentProps<typeof AccordionGroup>;
export type { KbAccordionGroup };
