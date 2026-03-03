import { createComponent } from '@lit/react';
import React from 'react';
import { KbFlex } from '../../components/layout/kb-flex.define.js';

export const Flex = createComponent({
  react: React,
  tagName: 'kb-flex',
  elementClass: KbFlex,
});

export type FlexProps = React.ComponentProps<typeof Flex>;
export type { KbFlex };
