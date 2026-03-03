import { createComponent } from '@lit/react';
import React from 'react';
import { KbText } from '../../components/typography/kb-text.define.js';

export const Text = createComponent({
  react: React,
  tagName: 'kb-text',
  elementClass: KbText,
});

export type TextProps = React.ComponentProps<typeof Text>;
export type { KbText };
export type { TextAs, TextTone, TextVariant } from '../../components/typography/kb-text.js';
