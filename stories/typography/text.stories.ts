import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/typography/kb-text.js';

type Args = {
  variant?: string;
  size?: string;
  tone?: string;
  as?: string;
  truncate?: boolean;
  'no-wrap'?: boolean;
  clamp?: number;
  maxW?: string;
};

export default {
  title: 'Typography/Text',
  component: 'kb-text',
  render: (args) => html`<kb-text ${spreadAttrs(args)}>The quick brown fox jumps over the lazy dog.</kb-text>`,
  args: { variant: 'body', size: 'base' },
  argTypes: {
    variant: { control: 'select', options: ['body', 'label', 'caption', 'overline'] },
    size: { control: 'select', options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] },
    tone: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'error'],
    },
    as: { control: 'select', options: ['p', 'span', 'div', 'label'] },
    truncate: { control: 'boolean' },
    'no-wrap': { control: 'boolean' },
    clamp: { control: 'number' },
  },
} satisfies Meta<Args>;

type S = StoryObj<Args>;

export const Default: S = {};

export const ExtraSmall: S = { args: { size: 'xs' } };

export const Small: S = { args: { size: 'sm' } };

export const Large: S = { args: { size: 'lg' } };

export const ExtraLarge: S = { args: { size: 'xl' } };

export const DoubleXL: S = { args: { size: '2xl' } };

export const Truncated: S = {
  args: { truncate: true, maxW: 'xs' },
  render: (args) =>
    html`<kb-text ${spreadAttrs(args)}>This is a very long text that will be truncated when it overflows the container.</kb-text>`,
};

export const Variants: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">body (default)</p>
        <kb-text variant="body">The quick brown fox jumps over the lazy dog. This is the default body text variant used for paragraphs and general content.</kb-text>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">label</p>
        <kb-text variant="label">Field label</kb-text>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">caption</p>
        <kb-text variant="caption">Updated 3 minutes ago by admin</kb-text>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">overline</p>
        <kb-text variant="overline">Section category</kb-text>
      </div>
    </div>
  `,
};

export const Label: S = { args: { variant: 'label' } };

export const Caption: S = {
  args: { variant: 'caption' },
  render: (args) => html`<kb-text ${spreadAttrs(args)}>Last updated 3 minutes ago</kb-text>`,
};

export const Overline: S = {
  args: { variant: 'overline' },
  render: (args) => html`<kb-text ${spreadAttrs(args)}>Featured</kb-text>`,
};

export const Tones: S = {
  render: () => html`
    <div class="flex flex-col gap-3">
      <kb-text tone="primary">Default (primary)</kb-text>
      <kb-text tone="secondary">Secondary tone</kb-text>
      <kb-text tone="muted">Muted tone</kb-text>
      <kb-text tone="accent">Accent tone</kb-text>
      <kb-text tone="success">Success tone</kb-text>
      <kb-text tone="warning">Warning tone</kb-text>
      <kb-text tone="error">Error tone</kb-text>
    </div>
  `,
};

export const LineClamping: S = {
  render: () => html`
    <div class="flex flex-col gap-6" style="max-width:400px;">
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">clamp=1</p>
        <kb-text clamp="1">This is a very long paragraph that should be clamped to a single line. It contains enough text to demonstrate the line clamping feature of the kb-text component.</kb-text>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">clamp=2</p>
        <kb-text clamp="2">This is a very long paragraph that should be clamped to two lines. It contains enough text to demonstrate the line clamping feature of the kb-text component. The remaining text will be hidden with an ellipsis.</kb-text>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">clamp=3</p>
        <kb-text clamp="3">This is a very long paragraph that should be clamped to three lines. It contains enough text to demonstrate the line clamping feature of the kb-text component. The remaining text will be hidden with an ellipsis. This paragraph has even more text to ensure it exceeds three lines at the given container width.</kb-text>
      </div>
    </div>
  `,
};

export const NoWrap: S = {
  render: () => html`
    <div style="max-width:250px;" class="border border-gray-200 dark:border-zinc-700 p-4">
      <kb-text no-wrap>This text will not wrap to the next line, it will overflow its container instead.</kb-text>
    </div>
  `,
};

export const AsElements: S = {
  render: () => html`
    <div class="flex flex-col gap-3">
      <kb-text as="p">Rendered as &lt;p&gt; (default)</kb-text>
      <kb-text as="span">Rendered as &lt;span&gt;</kb-text>
      <kb-text as="div">Rendered as &lt;div&gt;</kb-text>
      <kb-text as="label">Rendered as &lt;label&gt;</kb-text>
    </div>
  `,
};

export const ComposedExample: S = {
  render: () => html`
    <div class="flex flex-col gap-1 max-w-sm">
      <kb-text variant="overline" tone="accent">New Release</kb-text>
      <kb-text size="lg" font-weight="semibold">KarbitUI v2.0</kb-text>
      <kb-text variant="caption" tone="muted">Published on February 10, 2026</kb-text>
      <kb-text class="mt-2" clamp="3">The latest release of KarbitUI brings a complete typography enhancement pass with new variants, tone system, line clamping, and flexible element rendering. Build beautiful, structured interfaces with minimal effort.</kb-text>
    </div>
  `,
};
