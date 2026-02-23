import { createComponent } from '@lit/react';
import React from 'react';
import { KbCode } from '../../components/typography/kb-code.js';

export const Code = createComponent({
  react: React,
  tagName: 'kb-code',
  elementClass: KbCode,
});

export type CodeProps = React.ComponentProps<typeof Code>;
export type { KbCode };
export type { CodeHighlighter } from '../../components/typography/kb-code.js';
