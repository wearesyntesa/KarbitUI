import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTimePicker } from '../../components/forms/kb-time-picker.define.js';
import type { KbChangeValueDetail } from '../../core/events.js';

export const TimePicker = createComponent({
  react: React,
  tagName: 'kb-time-picker',
  elementClass: KbTimePicker,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export type TimePickerProps = React.ComponentProps<typeof TimePicker>;
export type { KbTimePicker };
export type { TimeFormat } from '../../components/forms/kb-time-picker.js';
