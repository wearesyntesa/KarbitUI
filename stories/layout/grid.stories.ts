import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-grid.js';
import '../../src/components/layout/kb-box.js';

const cells = html`
  <kb-box p="4" bg="yellow-100">1</kb-box>
  <kb-box p="4" bg="yellow-100">2</kb-box>
  <kb-box p="4" bg="yellow-100">3</kb-box>
  <kb-box p="4" bg="yellow-100">4</kb-box>
  <kb-box p="4" bg="yellow-100">5</kb-box>
  <kb-box p="4" bg="yellow-100">6</kb-box>
`;

type Args = { columns?: string; rows?: string; gap?: string };

export default {
  title: 'Layout/Grid',
  component: 'kb-grid',
  render: (args) => html`<kb-grid ${spreadAttrs(args)}>${cells}</kb-grid>`,
  args: { columns: '3', gap: '4' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const ThreeColumns: S = {};

export const TwoColumns: S = { args: { columns: '2' } };

export const FourColumns: S = { args: { columns: '4' } };

export const SingleColumn: S = { args: { columns: '1' } };

export const WithRows: S = { args: { columns: '3', rows: '2' } };

export const DashboardLayout: S = {
  render: () => html`
    <kb-grid columns="3" gap="4">
      <kb-box p="4" bg="white" class="border border-gray-200 dark:border-zinc-700 col-span-2">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">MAIN CONTENT</p>
        <p class="text-sm">Spans two columns.</p>
      </kb-box>
      <kb-box p="4" bg="white" class="border border-gray-200 dark:border-zinc-700">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">SIDEBAR</p>
        <p class="text-sm">Single column.</p>
      </kb-box>
      <kb-box p="4" bg="white" class="border border-gray-200 dark:border-zinc-700">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">WIDGET A</p>
      </kb-box>
      <kb-box p="4" bg="white" class="border border-gray-200 dark:border-zinc-700">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">WIDGET B</p>
      </kb-box>
      <kb-box p="4" bg="white" class="border border-gray-200 dark:border-zinc-700">
        <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">WIDGET C</p>
      </kb-box>
    </kb-grid>
  `,
};
