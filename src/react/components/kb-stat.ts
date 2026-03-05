import { createComponent } from '@lit/react';
import React from 'react';
import { KbStat } from '../../components/data-display/kb-stat.define.js';

export const Stat = createComponent({
  react: React,
  tagName: 'kb-stat',
  elementClass: KbStat,
});

export type StatProps = React.ComponentProps<typeof Stat>;
export type { KbStat };
export type { StatIndicator } from '../../components/data-display/kb-stat.js';
