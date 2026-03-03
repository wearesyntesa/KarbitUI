import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbInput } from '../../components/forms/kb-input.define.js';
import type { KbChangeValueDetailFor, KbInputDetail } from '../../core/events.js';

export const Input = createComponent({
  react: React,
  tagName: 'kb-input',
  elementClass: KbInput,
  events: {
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetailFor<'input'>>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export type InputProps = React.ComponentProps<typeof Input>;
export type { KbInput };
export type { InputType } from '../../components/forms/kb-input.js';
