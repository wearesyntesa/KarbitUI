import { createComponent } from '@lit/react';
import React from 'react';
import { KbBlockquote } from '../../components/typography/kb-blockquote.define.js';

export const Blockquote = createComponent({
  react: React,
  tagName: 'kb-blockquote',
  elementClass: KbBlockquote,
});

export type BlockquoteProps = React.ComponentProps<typeof Blockquote>;
export type { KbBlockquote };
export type { BlockquoteVariant } from '../../components/typography/kb-blockquote.js';
