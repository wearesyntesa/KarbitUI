import { createComponent } from '@lit/react';
import React from 'react';
import { KbAvatarGroup } from '../../components/data-display/kb-avatar-group.define.js';

export const AvatarGroup = createComponent({
  react: React,
  tagName: 'kb-avatar-group',
  elementClass: KbAvatarGroup,
});

export type AvatarGroupProps = React.ComponentProps<typeof AvatarGroup>;
export type { KbAvatarGroup };
export type { AvatarGroupSpacing } from '../../components/data-display/kb-avatar-group.js';
