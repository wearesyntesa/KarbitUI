import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTag } from '../../components/data-display/kb-tag.define.js';

export const Tag = createComponent({
  react: React,
  tagName: 'kb-tag',
  elementClass: KbTag,
  events: {
    onKbClick: 'kb-click' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type TagProps = React.ComponentProps<typeof Tag>;
export type { KbTag };
export type { TagSize, TagVariant } from '../../components/data-display/kb-tag.js';
