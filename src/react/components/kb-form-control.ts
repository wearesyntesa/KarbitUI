import { createComponent } from '@lit/react';
import React from 'react';
import { KbFormControl } from '../../components/forms/kb-form-control.js';

export const FormControl = createComponent({
  react: React,
  tagName: 'kb-form-control',
  elementClass: KbFormControl,
});

export type FormControlProps = React.ComponentProps<typeof FormControl>;
export type { KbFormControl };
