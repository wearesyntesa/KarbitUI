import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTabs } from '../../components/navigation/kb-tabs.js';
import type { KbTabChangeDetail } from '../../core/events.js';

export const Tabs = createComponent({
  react: React,
  tagName: 'kb-tabs',
  elementClass: KbTabs,
  events: {
    onKbTabChange: 'kb-tab-change' as EventName<CustomEvent<KbTabChangeDetail>>,
  },
});

export type TabsProps = React.ComponentProps<typeof Tabs>;
export type { KbTabs };
export type {
  TabsAlign,
  TabsColorScheme,
  TabsOrientation,
  TabsSize,
  TabsVariant,
} from '../../components/navigation/kb-tabs.js';
