import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbScrollArea } from '../../components/layout/kb-scroll-area.define.js';
import type { KbScrollDetail } from '../../core/events.js';

export const ScrollArea = createComponent({
  react: React,
  tagName: 'kb-scroll-area',
  elementClass: KbScrollArea,
  events: {
    onKbScroll: 'kb-scroll' as EventName<CustomEvent<KbScrollDetail>>,
  },
});

export type ScrollAreaProps = React.ComponentProps<typeof ScrollArea>;
export type { KbScrollArea };
export type { ScrollbarVisibility, ScrollDirection } from '../../components/layout/kb-scroll-area.js';
