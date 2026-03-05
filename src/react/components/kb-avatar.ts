import { createComponent } from '@lit/react';
import React from 'react';
import { KbAvatar } from '../../components/data-display/kb-avatar.define.js';

export const Avatar = createComponent({
  react: React,
  tagName: 'kb-avatar',
  elementClass: KbAvatar,
});

export type AvatarProps = React.ComponentProps<typeof Avatar>;
export type { KbAvatar };
export type { AvatarSize } from '../../components/data-display/kb-avatar.js';
