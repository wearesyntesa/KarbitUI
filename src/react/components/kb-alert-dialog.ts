import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbAlertDialog } from '../../components/overlay/kb-alert-dialog.define.js';
import type { KbCancelDetail, KbConfirmDetail } from '../../core/events.js';

export const AlertDialog = createComponent({
  react: React,
  tagName: 'kb-alert-dialog',
  elementClass: KbAlertDialog,
  events: {
    onKbConfirm: 'kb-confirm' as EventName<CustomEvent<KbConfirmDetail>>,
    onKbCancel: 'kb-cancel' as EventName<CustomEvent<KbCancelDetail>>,
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type AlertDialogProps = React.ComponentProps<typeof AlertDialog>;
export type { KbAlertDialog };
