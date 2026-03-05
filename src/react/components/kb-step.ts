import { createComponent } from '@lit/react';
import React from 'react';
import { KbStep } from '../../components/navigation/kb-step.define.js';

export const Step = createComponent({
  react: React,
  tagName: 'kb-step',
  elementClass: KbStep,
});

export type StepProps = React.ComponentProps<typeof Step>;
export type { KbStep };
