import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbClipboard } from '../../components/feedback/kb-clipboard.define.js';
import type { KbCopyDetail } from '../../core/events.js';

export const Clipboard = createComponent({
  react: React,
  tagName: 'kb-clipboard',
  elementClass: KbClipboard,
  events: {
    onKbCopy: 'kb-copy' as EventName<CustomEvent<KbCopyDetail>>,
  },
});

export type ClipboardProps = React.ComponentProps<typeof Clipboard>;
export type { KbClipboard };
export type { ClipboardVariant } from '../../components/feedback/kb-clipboard.js';
