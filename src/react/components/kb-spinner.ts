import { createComponent } from '@lit/react';
import React from 'react';
import { KbSpinner } from '../../components/feedback/kb-spinner.define.js';

export const Spinner = createComponent({
  react: React,
  tagName: 'kb-spinner',
  elementClass: KbSpinner,
});

export type SpinnerProps = React.ComponentProps<typeof Spinner>;
export type { KbSpinner };
export type { SpinnerSpeed, SpinnerVariant } from '../../components/feedback/kb-spinner.js';
