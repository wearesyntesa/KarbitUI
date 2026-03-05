import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbSlider } from '../../components/forms/kb-slider.define.js';
import type { KbChangeValueDetail, KbInputDetail } from '../../core/events.js';

export const Slider = createComponent({
  react: React,
  tagName: 'kb-slider',
  elementClass: KbSlider,
  events: {
    onKbChange: 'kb-change' as EventName<CustomEvent<KbChangeValueDetail>>,
    onKbInput: 'kb-input' as EventName<CustomEvent<KbInputDetail>>,
  },
});

export type SliderProps = React.ComponentProps<typeof Slider>;
export type { KbSlider };
