import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbCarousel } from '../../components/data-display/kb-carousel.define.js';
import type { KbSlideChangeDetail } from '../../core/events.js';

export const Carousel = createComponent({
  react: React,
  tagName: 'kb-carousel',
  elementClass: KbCarousel,
  events: {
    onKbSlideChange: 'kb-slide-change' as EventName<CustomEvent<KbSlideChangeDetail>>,
  },
});

export type CarouselProps = React.ComponentProps<typeof Carousel>;
export type { KbCarousel };
