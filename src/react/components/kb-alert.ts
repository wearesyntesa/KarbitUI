import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbAlert } from '../../components/feedback/kb-alert.define.js';
import type { KbToggleDetail } from '../../core/events.js';

export const Alert = createComponent({
  react: React,
  tagName: 'kb-alert',
  elementClass: KbAlert,
  events: {
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
    onKbToggle: 'kb-toggle' as EventName<CustomEvent<KbToggleDetail>>,
  },
});

export type AlertProps = React.ComponentProps<typeof Alert>;
export type { KbAlert };
export type { AlertSize, AlertStatus, AlertVariant } from '../../components/feedback/kb-alert.js';
