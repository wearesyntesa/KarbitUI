import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTagsInput } from '../../components/forms/kb-tags-input.define.js';
import type { KbChangeGroupDetail, KbTagAddDetail, KbTagRemoveDetail } from '../../core/events.js';

export const TagsInput = createComponent({
  react: React,
  tagName: 'kb-tags-input',
  elementClass: KbTagsInput,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeGroupDetail>>,
    onKbTagAdd: 'kb-tag-add' as EventName<CustomEvent<KbTagAddDetail>>,
    onKbTagRemove: 'kb-tag-remove' as EventName<CustomEvent<KbTagRemoveDetail>>,
  },
});

export type TagsInputProps = React.ComponentProps<typeof TagsInput>;
export type { KbTagsInput };
