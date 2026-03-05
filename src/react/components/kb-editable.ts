import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbEditable } from '../../components/forms/kb-editable.define.js';
import type { KbChangeValueDetail, KbEditCancelDetail, KbEditSubmitDetail } from '../../core/events.js';

export const Editable = createComponent({
  react: React,
  tagName: 'kb-editable',
  elementClass: KbEditable,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbEditSubmit: 'kb-edit-submit' as EventName<CustomEvent<KbEditSubmitDetail>>,
    onKbEditCancel: 'kb-edit-cancel' as EventName<CustomEvent<KbEditCancelDetail>>,
  },
});

export type EditableProps = React.ComponentProps<typeof Editable>;
export type { KbEditable };
