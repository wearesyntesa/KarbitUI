import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTooltip } from '../../components/overlay/kb-tooltip.js';

export const Tooltip = createComponent({
  react: React,
  tagName: 'kb-tooltip',
  elementClass: KbTooltip,
  events: {
    onKbOpen: 'kb-open' as EventName<CustomEvent<undefined>>,
    onKbClose: 'kb-close' as EventName<CustomEvent<undefined>>,
  },
});

export type TooltipProps = React.ComponentProps<typeof Tooltip>;
export type { KbTooltip };
export type { TooltipPlacement, TooltipSize, TooltipVariant } from '../../components/overlay/kb-tooltip.js';
