import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbFileUpload } from '../../components/forms/kb-file-upload.define.js';
import type { KbFileRemoveDetail, KbFileSelectDetail } from '../../core/events.js';

export const FileUpload = createComponent({
  react: React,
  tagName: 'kb-file-upload',
  elementClass: KbFileUpload,
  events: {
    onKbFileSelect: 'kb-file-select' as EventName<CustomEvent<KbFileSelectDetail>>,
    onKbFileRemove: 'kb-file-remove' as EventName<CustomEvent<KbFileRemoveDetail>>,
  },
});

export type FileUploadProps = React.ComponentProps<typeof FileUpload>;
export type { KbFileUpload };
