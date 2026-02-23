import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbBreadcrumb } from '../../components/navigation/kb-breadcrumb.js';
import type { KbNavigateDetail } from '../../core/events.js';

export const Breadcrumb = createComponent({
  react: React,
  tagName: 'kb-breadcrumb',
  elementClass: KbBreadcrumb,
  events: {
    onKbNavigate: 'kb-navigate' as EventName<CustomEvent<KbNavigateDetail>>,
  },
});

export type BreadcrumbProps = React.ComponentProps<typeof Breadcrumb>;
export type { KbBreadcrumb };
export type { SeparatorType } from '../../components/navigation/kb-breadcrumb.js';
