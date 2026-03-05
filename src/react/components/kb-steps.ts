import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbSteps } from '../../components/navigation/kb-steps.define.js';
import type { KbStepClickDetail } from '../../core/events.js';

export const Steps = createComponent({
  react: React,
  tagName: 'kb-steps',
  elementClass: KbSteps,
  events: {
    onKbStepClick: 'kb-step-click' as EventName<CustomEvent<KbStepClickDetail>>,
  },
});

export type StepsProps = React.ComponentProps<typeof Steps>;
export type { KbSteps };
