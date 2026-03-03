import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbRadioGroup } from '../../components/forms/kb-radio-group.define.js';
import type { KbChangeValueDetail } from '../../core/events.js';

export const RadioGroup = createComponent({
  react: React,
  tagName: 'kb-radio-group',
  elementClass: KbRadioGroup,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
  },
});

export type RadioGroupProps = React.ComponentProps<typeof RadioGroup>;
export type { KbRadioGroup };
