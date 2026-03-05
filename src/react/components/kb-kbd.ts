import { createComponent } from '@lit/react';
import React from 'react';
import { KbKbd } from '../../components/data-display/kb-kbd.define.js';

export const Kbd = createComponent({
  react: React,
  tagName: 'kb-kbd',
  elementClass: KbKbd,
});

export type KbdProps = React.ComponentProps<typeof Kbd>;
export type { KbKbd };
export type { KbdSize } from '../../components/data-display/kb-kbd.js';
