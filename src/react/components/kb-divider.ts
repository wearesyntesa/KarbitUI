import { createComponent } from '@lit/react';
import React from 'react';
import { KbDivider } from '../../components/layout/kb-divider.js';

export const Divider = createComponent({
  react: React,
  tagName: 'kb-divider',
  elementClass: KbDivider,
});

export type DividerProps = React.ComponentProps<typeof Divider>;
export type { KbDivider };
export type { DividerThickness, DividerVariant } from '../../components/layout/kb-divider.js';
