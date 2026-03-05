import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbNumberInput } from '../../components/forms/kb-number-input.define.js';
import type { KbChangeValueDetail, KbInputDetail } from '../../core/events.js';

export const NumberInput = createComponent({
  react: React,
  tagName: 'kb-number-input',
  elementClass: KbNumberInput,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
  },
});

export type NumberInputProps = React.ComponentProps<typeof NumberInput>;
export type { KbNumberInput };
