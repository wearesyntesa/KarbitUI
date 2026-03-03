import { createComponent } from '@lit/react';
import React from 'react';
import { KbGrid } from '../../components/layout/kb-grid.define.js';

export const Grid = createComponent({
  react: React,
  tagName: 'kb-grid',
  elementClass: KbGrid,
});

export type GridProps = React.ComponentProps<typeof Grid>;
export type { KbGrid };
