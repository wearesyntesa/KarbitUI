import { createComponent } from '@lit/react';
import React from 'react';
import { KbProgress } from '../../components/feedback/kb-progress.js';

export const Progress = createComponent({
  react: React,
  tagName: 'kb-progress',
  elementClass: KbProgress,
});

export type ProgressProps = React.ComponentProps<typeof Progress>;
export type { KbProgress };
export type { ProgressSize } from '../../components/feedback/kb-progress.js';
