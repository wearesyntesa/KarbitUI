import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbModal } from '../../components/overlay/kb-modal.define.js';

export const Modal = createComponent({
  react: React,
  tagName: 'kb-modal',
  elementClass: KbModal,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type ModalProps = React.ComponentProps<typeof Modal>;
export type { KbModal };
export type { ModalPlacement } from '../../components/overlay/kb-modal.js';
