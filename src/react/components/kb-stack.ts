import { createComponent } from '@lit/react';
import React from 'react';
import { KbStack } from '../../components/layout/kb-stack.js';

export const Stack = createComponent({
  react: React,
  tagName: 'kb-stack',
  elementClass: KbStack,
});

export type StackProps = React.ComponentProps<typeof Stack>;
export type { KbStack };
