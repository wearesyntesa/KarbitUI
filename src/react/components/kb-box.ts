import { createComponent } from '@lit/react';
import React from 'react';
import { KbBox } from '../../components/layout/kb-box.js';

export const Box = createComponent({
  react: React,
  tagName: 'kb-box',
  elementClass: KbBox,
});

export type BoxProps = React.ComponentProps<typeof Box>;
export type { KbBox };
