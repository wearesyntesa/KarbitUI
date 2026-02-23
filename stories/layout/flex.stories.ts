import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-flex.js';
import '../../src/components/layout/kb-box.js';

const boxes = html`
  <kb-box p="4" bg="red-100">One</kb-box>
  <kb-box p="4" bg="blue-100">Two</kb-box>
  <kb-box p="4" bg="green-100">Three</kb-box>
`;

type Args = { gap?: string; direction?: string; align?: string; justify?: string; h?: string };

export default {
  title: 'Layout/Flex',
  component: 'kb-flex',
  render: (args) => html`<kb-flex ${spreadAttrs(args)}>${boxes}</kb-flex>`,
  args: { gap: '4' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Row: S = {};

export const Column: S = { args: { direction: 'col' } };

export const Centered: S = { args: { align: 'center', justify: 'center', h: '48' } };

export const SpaceBetween: S = { args: { justify: 'between' } };

export const Wrap: S = {
  render: () => html`
    <kb-flex wrap="wrap" gap="4">
      ${Array.from({ length: 8 }, (_, i) => html`<kb-box p="4" bg="gray-100" w="32">Item ${i + 1}</kb-box>`)}
    </kb-flex>
  `,
};

export const Toolbar: S = {
  render: () => html`
    <kb-flex justify="between" align="center" p="3" bg="gray-50" class="border border-gray-200 dark:border-zinc-700">
      <span class="font-mono text-xs uppercase tracking-widest text-slate-500">TOOLBAR</span>
      <kb-flex gap="2">
        <kb-box px="3" py="1" bg="white" class="border border-gray-200 text-xs">Action A</kb-box>
        <kb-box px="3" py="1" bg="white" class="border border-gray-200 text-xs">Action B</kb-box>
      </kb-flex>
    </kb-flex>
  `,
};
