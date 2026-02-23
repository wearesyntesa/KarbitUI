import { createComponent } from '@lit/react';
import React from 'react';
import { KbIconButton } from '../../components/forms/kb-icon-button.js';

export const IconButton = createComponent({
  react: React,
  tagName: 'kb-icon-button',
  elementClass: KbIconButton,
});

export type IconButtonProps = React.ComponentProps<typeof IconButton>;
export type { KbIconButton };
export type { IconButtonVariant } from '../../components/forms/kb-icon-button.js';
