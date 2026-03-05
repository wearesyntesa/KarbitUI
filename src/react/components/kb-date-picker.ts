import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbDatePicker } from '../../components/forms/kb-date-picker.define.js';
import type { KbChangeValueDetail } from '../../core/events.js';

export const DatePicker = createComponent({
  react: React,
  tagName: 'kb-date-picker',
  elementClass: KbDatePicker,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export type DatePickerProps = React.ComponentProps<typeof DatePicker>;
export type { KbDatePicker };
