import { createComponent } from '@lit/react';
import React from 'react';
import { KbButtonGroup } from '../../components/forms/kb-button-group.js';

export const ButtonGroup = createComponent({
  react: React,
  tagName: 'kb-button-group',
  elementClass: KbButtonGroup,
});

export type ButtonGroupProps = React.ComponentProps<typeof ButtonGroup>;
export type { KbButtonGroup };
export type { ButtonGroupDirection } from '../../components/forms/kb-button-group.js';
