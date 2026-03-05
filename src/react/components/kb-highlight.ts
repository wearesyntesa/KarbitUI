import { createComponent } from '@lit/react';
import React from 'react';
import { KbHighlight } from '../../components/typography/kb-highlight.define.js';

export const Highlight = createComponent({
  react: React,
  tagName: 'kb-highlight',
  elementClass: KbHighlight,
});

export type HighlightProps = React.ComponentProps<typeof Highlight>;
export type { KbHighlight };
