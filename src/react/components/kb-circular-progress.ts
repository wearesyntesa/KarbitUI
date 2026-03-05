import { createComponent } from '@lit/react';
import React from 'react';
import { KbCircularProgress } from '../../components/feedback/kb-circular-progress.define.js';

export const CircularProgress = createComponent({
  react: React,
  tagName: 'kb-circular-progress',
  elementClass: KbCircularProgress,
});

export type CircularProgressProps = React.ComponentProps<typeof CircularProgress>;
export type { KbCircularProgress };
