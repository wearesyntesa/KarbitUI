import { createComponent } from '@lit/react';
import React from 'react';
import { KbEmptyState } from '../../components/feedback/kb-empty-state.define.js';

export const EmptyState = createComponent({
  react: React,
  tagName: 'kb-empty-state',
  elementClass: KbEmptyState,
});

export type EmptyStateProps = React.ComponentProps<typeof EmptyState>;
export type { KbEmptyState };
