import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbSwitch } from '../../components/forms/kb-switch.js';
import type { KbChangeCheckedDetail } from '../../core/events.js';

export const Switch = createComponent({
  react: React,
  tagName: 'kb-switch',
  elementClass: KbSwitch,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeCheckedDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
  },
});

export type SwitchProps = React.ComponentProps<typeof Switch>;
export type { KbSwitch };
export type { SwitchLabelPosition } from '../../components/forms/kb-switch.js';
