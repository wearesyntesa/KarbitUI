import { createComponent, type EventName } from '@lit/react';
import React from 'react';
import { KbTreeView } from '../../components/data-display/kb-tree-view.define.js';
import type { KbNodeSelectDetail, KbNodeToggleDetail } from '../../core/events.js';

export const TreeView = createComponent({
  react: React,
  tagName: 'kb-tree-view',
  elementClass: KbTreeView,
  events: {
    onKbNodeToggle: 'kb-node-toggle' as EventName<CustomEvent<KbNodeToggleDetail>>,
    onKbNodeSelect: 'kb-node-select' as EventName<CustomEvent<KbNodeSelectDetail>>,
  },
});

export type TreeViewProps = React.ComponentProps<typeof TreeView>;
export type { KbTreeView };
export type { TreeNode } from '../../components/data-display/kb-tree-view.js';
