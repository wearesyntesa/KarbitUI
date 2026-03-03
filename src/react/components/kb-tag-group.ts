import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTagGroup } from '../../components/data-display/kb-tag-group.define.js';
import type { KbReorderDetail } from '../../core/events.js';

export const TagGroup = createComponent({
  react: React,
  tagName: 'kb-tag-group',
  elementClass: KbTagGroup,
  events: {
    onKbReorder: 'kb-reorder' as EventName<CustomEvent<KbReorderDetail>>,
  },
});

export type TagGroupProps = React.ComponentProps<typeof TagGroup>;
export type { KbTagGroup };
export type { TagGroupGap } from '../../components/data-display/kb-tag-group.js';
