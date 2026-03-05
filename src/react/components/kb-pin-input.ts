import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbPinInput } from '../../components/forms/kb-pin-input.define.js';
import type { KbChangeValueDetail, KbCompleteDetail, KbInputDetail } from '../../core/events.js';

export const PinInput = createComponent({
  react: React,
  tagName: 'kb-pin-input',
  elementClass: KbPinInput,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
    onKbComplete: 'kb-complete' as EventName<CustomEvent<KbCompleteDetail>>,
  },
});

export type PinInputProps = React.ComponentProps<typeof PinInput>;
export type { KbPinInput };
export type { PinInputType } from '../../components/forms/kb-pin-input.js';
