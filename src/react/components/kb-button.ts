import { createComponent } from '@lit/react';
import React from 'react';
import { KbButton } from '../../components/forms/kb-button.define.js';

export const Button = createComponent({
  react: React,
  tagName: 'kb-button',
  elementClass: KbButton,
});

export type ButtonProps = React.ComponentProps<typeof Button>;
export type { KbButton };
export type { ButtonSize, ButtonVariant } from '../../components/forms/kb-button.js';
