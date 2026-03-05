import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/overlay/kb-dropdown-menu.define.js';
import '../../src/components/overlay/kb-menu-item.define.js';

const triggerBtn = html`
  <button
    slot="trigger"
    class="px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
  >Actions</button>
`;

function triggerLabel(label: string) {
  return html`
    <button
      slot="trigger"
      class="px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
    >${label}</button>
  `;
}

export default {
  title: 'Overlay/DropdownMenu',
  component: 'kb-dropdown-menu',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-dropdown-menu>
      ${triggerBtn}
      <kb-menu-item value="edit">Edit</kb-menu-item>
      <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
      <kb-menu-item value="archive">Archive</kb-menu-item>
    </kb-dropdown-menu>
  `,
};

export const WithDestructive: S = {
  render: () => html`
    <kb-dropdown-menu>
      ${triggerBtn}
      <kb-menu-item value="edit">Edit</kb-menu-item>
      <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
      <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
    </kb-dropdown-menu>
  `,
};

export const DisabledItems: S = {
  render: () => html`
    <kb-dropdown-menu>
      ${triggerBtn}
      <kb-menu-item value="edit">Edit</kb-menu-item>
      <kb-menu-item value="duplicate" disabled>Duplicate</kb-menu-item>
      <kb-menu-item value="archive">Archive</kb-menu-item>
      <kb-menu-item value="delete" destructive disabled>Delete</kb-menu-item>
    </kb-dropdown-menu>
  `,
};

export const PlacementTop: S = {
  render: () => html`
    <div style="margin-top: 200px">
      <kb-dropdown-menu placement="top">
        ${triggerLabel('Open Up')}
        <kb-menu-item value="edit">Edit</kb-menu-item>
        <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-dropdown-menu>
    </div>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: start; flex-wrap: wrap">
      <kb-dropdown-menu size="sm">
        ${triggerLabel('SM')}
        <kb-menu-item value="edit">Edit</kb-menu-item>
        <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-dropdown-menu>

      <kb-dropdown-menu size="md">
        ${triggerLabel('MD')}
        <kb-menu-item value="edit">Edit</kb-menu-item>
        <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-dropdown-menu>

      <kb-dropdown-menu size="lg">
        ${triggerLabel('LG')}
        <kb-menu-item value="edit">Edit</kb-menu-item>
        <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
        <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
      </kb-dropdown-menu>
    </div>
  `,
};

export const ManyItems: S = {
  render: () => html`
    <kb-dropdown-menu>
      ${triggerBtn}
      <kb-menu-item value="view">View</kb-menu-item>
      <kb-menu-item value="edit">Edit</kb-menu-item>
      <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
      <kb-menu-item value="rename">Rename</kb-menu-item>
      <kb-menu-item value="move">Move to folder</kb-menu-item>
      <kb-menu-item value="archive">Archive</kb-menu-item>
      <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
    </kb-dropdown-menu>
  `,
};

export const InitiallyOpen: S = {
  render: () => html`
    <kb-dropdown-menu open>
      ${triggerBtn}
      <kb-menu-item value="edit">Edit</kb-menu-item>
      <kb-menu-item value="duplicate">Duplicate</kb-menu-item>
      <kb-menu-item value="delete" destructive>Delete</kb-menu-item>
    </kb-dropdown-menu>
  `,
};
