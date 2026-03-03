import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbCheckbox } from '../../components/forms/kb-checkbox.define.js';
import type { KbChangeCheckboxDetail } from '../../core/events.js';

export const Checkbox = createComponent({
  react: React,
  tagName: 'kb-checkbox',
  elementClass: KbCheckbox,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeCheckboxDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
  },
});

export type CheckboxProps = React.ComponentProps<typeof Checkbox>;
export type { KbCheckbox };
