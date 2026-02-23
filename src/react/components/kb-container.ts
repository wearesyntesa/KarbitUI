import { createComponent } from '@lit/react';
import React from 'react';
import { KbContainer } from '../../components/layout/kb-container.js';

export const Container = createComponent({
  react: React,
  tagName: 'kb-container',
  elementClass: KbContainer,
});

export type ContainerProps = React.ComponentProps<typeof Container>;
export type { KbContainer };
export type { ContainerSize } from '../../components/layout/kb-container.js';
