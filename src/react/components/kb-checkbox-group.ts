import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbCheckboxGroup } from '../../components/forms/kb-checkbox-group.define.js';
import type { KbChangeGroupDetail } from '../../core/events.js';

export const CheckboxGroup = createComponent({
  react: React,
  tagName: 'kb-checkbox-group',
  elementClass: KbCheckboxGroup,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeGroupDetail>>,
  },
});

export type CheckboxGroupProps = React.ComponentProps<typeof CheckboxGroup>;
export type { KbCheckboxGroup };
