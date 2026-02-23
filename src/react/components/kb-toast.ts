import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbToast } from '../../components/feedback/kb-toast.js';

export const Toast = createComponent({
  react: React,
  tagName: 'kb-toast',
  elementClass: KbToast,
  events: {
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type ToastProps = React.ComponentProps<typeof Toast>;
export type { KbToast };
export type { ToastPosition, ToastStatus } from '../../components/feedback/kb-toast.js';
