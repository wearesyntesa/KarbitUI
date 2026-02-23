import { createComponent } from '@lit/react';
import React from 'react';
import { KbHeading } from '../../components/typography/kb-heading.js';

export const Heading = createComponent({
  react: React,
  tagName: 'kb-heading',
  elementClass: KbHeading,
});

export type HeadingProps = React.ComponentProps<typeof Heading>;
export type { KbHeading };
export type { HeadingLevel, HeadingSize, HeadingTone, HeadingWeight } from '../../components/typography/kb-heading.js';
