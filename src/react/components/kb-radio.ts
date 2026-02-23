import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbRadio } from '../../components/forms/kb-radio.js';
import type { KbChangeRadioDetail } from '../../core/events.js';

export const Radio = createComponent({
  react: React,
  tagName: 'kb-radio',
  elementClass: KbRadio,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeRadioDetail>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
  },
});

export type RadioProps = React.ComponentProps<typeof Radio>;
export type { KbRadio };
