import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/layout/kb-container.js';

type Args = { bg?: string; p?: string; max?: string; center?: boolean; size?: string };

export default {
  title: 'Layout/Container',
  component: 'kb-container',
  render: (args) =>
    html`<kb-container ${spreadAttrs(args)}>Contained content with max-width constraint.</kb-container>`,
  args: { bg: 'gray-100', p: '6' },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {};

export const Narrow: S = { args: { max: 'sm' } };

export const Wide: S = { args: { max: '5xl' } };

export const NotCentered: S = { args: { center: false } };

export const SizeSmall: S = { args: { size: 'sm' } };

export const SizeMedium: S = { args: { size: 'md' } };

export const SizeLarge: S = { args: { size: 'lg' } };

export const SizeXL: S = { args: { size: 'xl' } };

export const Size2XL: S = { args: { size: '2xl' } };

export const SizeFull: S = { args: { size: 'full' } };

export const AllSizes: S = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${(['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map(
        (size) => html`
          <kb-container size=${size} bg="gray-100" p="4">
            <p class="text-xs font-mono text-slate-500">size="${size}"</p>
          </kb-container>
        `,
      )}
    </div>
  `,
};

export const Nested: S = {
  render: () => html`
    <kb-container size="xl" bg="gray-100" p="6">
      <p class="text-xs font-mono text-slate-500 mb-4">OUTER: size="xl"</p>
      <kb-container size="md" bg="gray-200" p="4">
        <p class="text-xs font-mono text-slate-500">INNER: size="md"</p>
      </kb-container>
    </kb-container>
  `,
};
