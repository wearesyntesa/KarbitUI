import { createComponent } from '@lit/react';
import React from 'react';
import { KbFormLabel } from '../../components/forms/kb-form-label.define.js';

export const FormLabel = createComponent({
  react: React,
  tagName: 'kb-form-label',
  elementClass: KbFormLabel,
});

export type FormLabelProps = React.ComponentProps<typeof FormLabel>;
export type { KbFormLabel };
