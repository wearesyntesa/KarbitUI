import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTextarea } from '../../components/forms/kb-textarea.define.js';
import type { KbChangeValueDetailFor, KbInputDetail } from '../../core/events.js';

export const Textarea = createComponent({
  react: React,
  tagName: 'kb-textarea',
  elementClass: KbTextarea,
  events: {
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetailFor<'textarea'>>>,
    onKbFocus: 'kb-focus' as EventName<CustomEvent<undefined>>,
    onKbBlur: 'kb-blur' as EventName<CustomEvent<undefined>>,
    onKbClear: 'kb-clear' as EventName<CustomEvent<undefined>>,
  },
});

export type TextareaProps = React.ComponentProps<typeof Textarea>;
export type { KbTextarea };
export type { ResizeMode } from '../../components/forms/kb-textarea.js';
