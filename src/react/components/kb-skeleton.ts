import { createComponent } from '@lit/react';
import React from 'react';
import { KbSkeleton } from '../../components/feedback/kb-skeleton.define.js';

export const Skeleton = createComponent({
  react: React,
  tagName: 'kb-skeleton',
  elementClass: KbSkeleton,
});

export type SkeletonProps = React.ComponentProps<typeof Skeleton>;
export type { KbSkeleton };
export type { SkeletonVariant } from '../../components/feedback/kb-skeleton.js';
