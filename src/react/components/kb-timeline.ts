import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTimeline } from '../../components/data-display/kb-timeline.define.js';
import type { KbTimelineItemClickDetail } from '../../core/events.js';

export const Timeline = createComponent({
  react: React,
  tagName: 'kb-timeline',
  elementClass: KbTimeline,
  events: {
    onKbTimelineItemClick: 'kb-timeline-item-click' as EventName<CustomEvent<KbTimelineItemClickDetail>>,
  },
});

export type TimelineProps = React.ComponentProps<typeof Timeline>;
export type { KbTimeline };
export type { TimelineItem, TimelineLineVariant, TimelineVariant } from '../../components/data-display/kb-timeline.js';
