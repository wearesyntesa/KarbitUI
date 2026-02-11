import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-box.js';

export default {
  title: 'Layout/Box',
  component: 'kb-box',
  render: (args) => html`<kb-box ${spreadAttrs(args)}>Box content</kb-box>`,
  args: { p: '4', bg: 'white' },
} satisfies Meta;

type S = StoryObj;

export const Default: S = {};

export const Padded: S = {
  args: { p: '6' },
  render: (args) => html`<kb-box ${spreadAttrs(args)}>Box with extra padding</kb-box>`,
};

export const Colored: S = {
  args: { bg: 'blue-500', color: 'white', p: '6' },
  render: (args) => html`<kb-box ${spreadAttrs(args)}>Colored box</kb-box>`,
};

export const WithBorder: S = {
  args: { p: '6', border: '', rounded: 'none', bg: 'white' },
  render: (args) =>
    html`<kb-box ${spreadAttrs(args)} class="border border-gray-200 dark:border-zinc-700">Bordered box</kb-box>`,
};

export const Shadow: S = {
  args: { p: '6', bg: 'white', shadow: 'md' },
  render: (args) => html`<kb-box ${spreadAttrs(args)}>Box with shadow</kb-box>`,
};

export const AsCard: S = {
  render: () => html`
    <kb-box p="6" bg="white" shadow="sm" class="border border-gray-200 dark:border-zinc-700">
      <p class="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2">CARD PATTERN</p>
      <p class="text-sm text-slate-700 dark:text-zinc-300">A box styled like a card using only style props.</p>
    </kb-box>
  `,
};
