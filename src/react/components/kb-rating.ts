import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbRating } from '../../components/forms/kb-rating.define.js';
import type { KbChangeValueDetail, KbRatingHoverDetail } from '../../core/events.js';

export const Rating = createComponent({
  react: React,
  tagName: 'kb-rating',
  elementClass: KbRating,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbRatingHover: 'kb-rating-hover' as EventName<CustomEvent<KbRatingHoverDetail>>,
  },
});

export type RatingProps = React.ComponentProps<typeof Rating>;
export type { KbRating };
