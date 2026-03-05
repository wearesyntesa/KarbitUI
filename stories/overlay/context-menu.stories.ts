import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-context-menu.define.js';
import '../../src/components/overlay/kb-menu-item.define.js';

const triggerArea = html`
  <div
    slot="trigger"
    class="flex items-center justify-center border border-dashed border-gray-300 dark:border-zinc-600 p-8 font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 select-none"
  >Right-click here</div>
`;

function triggerWithLabel(label: string) {
  return html`
    <div
      slot="trigger"
      class="flex items-center justify-center border border-dashed border-gray-300 dark:border-zinc-600 p-8 font-mono text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 select-none"
    >${label}</div>
  `;
}

export default {
  title: 'Overlay/ContextMenu',
  component: 'kb-context-menu',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-context-menu>
      ${triggerArea}
      <kb-menu-item value="copy">Copy</kb-menu-item>
      <kb-menu-item value="cut">Cut</kb-menu-item>
      <kb-menu-item value="paste">Paste</kb-menu-item>
    </kb-context-menu>
  `,
};

export const WithDestructive: S = {
  render: () => html`
    <kb-context-menu>
      ${triggerArea}
      <kb-menu-item value="edit">Edit</kb-menu-item>
      <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
      <kb-menu-item value="archive">Archive</kb-menu-item>
      <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
    </kb-context-menu>
  `,
};

export const DisabledItems: S = {
  render: () => html`
    <kb-context-menu>
      ${triggerArea}
      <kb-menu-item value="copy">Copy</kb-menu-item>
      <kb-menu-item value="cut" disabled>Cut</kb-menu-item>
      <kb-menu-item value="paste">Paste</kb-menu-item>
      <kb-menu-item value="delete" destructive disabled>Delete</kb-menu-item>
    </kb-context-menu>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div style="display: flex; gap: 24px; flex-wrap: wrap">
      <kb-context-menu size="sm">
        ${triggerWithLabel('SM — Right-click')}
        <kb-menu-item value="edit">Edit</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-context-menu>

      <kb-context-menu size="md">
        ${triggerWithLabel('MD — Right-click')}
        <kb-menu-item value="edit">Edit</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-context-menu>

      <kb-context-menu size="lg">
        ${triggerWithLabel('LG — Right-click')}
        <kb-menu-item value="edit">Edit</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-context-menu>
    </div>
  `,
};

export const ManyItems: S = {
  render: () => html`
    <kb-context-menu>
      ${triggerArea}
      <kb-menu-item value="view">View details</kb-menu-item>
      <kb-menu-item value="edit">Edit</kb-menu-item>
      <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
      <kb-menu-item value="rename">Rename</kb-menu-item>
      <kb-menu-item value="move">Move to folder</kb-menu-item>
      <kb-menu-item value="share">Share</kb-menu-item>
      <kb-menu-item value="export">Export</kb-menu-item>
      <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
    </kb-context-menu>
  `,
};
