import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { spreadAttrs } from '../_define.js';
import '../../src/components/typography/kb-heading.js';

export default {
  title: 'Typography/Heading',
  component: 'kb-heading',
  render: (args) => html`<kb-heading ${spreadAttrs(args)}>Section heading</kb-heading>`,
  args: { level: '2', weight: 'bold' },
  argTypes: {
    level: { control: 'select', options: ['1', '2', '3', '4', '5', '6'] },
    size: { control: 'select', options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] },
    weight: { control: 'select', options: ['medium', 'semibold', 'bold', 'extrabold', 'black'] },
    tone: { control: 'select', options: [undefined, 'primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'error'] },
    truncate: { control: 'boolean' },
  },
} satisfies Meta;

type S = StoryObj;

export const H1: S = { args: { level: '1' } };

export const H2: S = { args: { level: '2' } };

export const H3: S = { args: { level: '3' } };

export const H4: S = { args: { level: '4' } };

export const H5: S = { args: { level: '5' } };

export const H6: S = { args: { level: '6' } };

export const CustomSize: S = { args: { level: '2', size: '4xl' } };

export const AllLevels: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <kb-heading level="1">Heading Level 1</kb-heading>
      <kb-heading level="2">Heading Level 2</kb-heading>
      <kb-heading level="3">Heading Level 3</kb-heading>
      <kb-heading level="4">Heading Level 4</kb-heading>
      <kb-heading level="5">Heading Level 5</kb-heading>
      <kb-heading level="6">Heading Level 6</kb-heading>
    </div>
  `,
};

export const Weights: S = {
  render: () => html`
    <div class="flex flex-col gap-4">
      <kb-heading level="3" weight="medium">Medium weight</kb-heading>
      <kb-heading level="3" weight="semibold">Semibold weight</kb-heading>
      <kb-heading level="3" weight="bold">Bold weight (default)</kb-heading>
      <kb-heading level="3" weight="extrabold">Extrabold weight</kb-heading>
      <kb-heading level="3" weight="black">Black weight</kb-heading>
    </div>
  `,
};

export const Tones: S = {
  render: () => html`
    <div class="flex flex-col gap-3">
      <kb-heading level="4">Default (primary)</kb-heading>
      <kb-heading level="4" tone="secondary">Secondary tone</kb-heading>
      <kb-heading level="4" tone="muted">Muted tone</kb-heading>
      <kb-heading level="4" tone="accent">Accent tone</kb-heading>
      <kb-heading level="4" tone="success">Success tone</kb-heading>
      <kb-heading level="4" tone="warning">Warning tone</kb-heading>
      <kb-heading level="4" tone="error">Error tone</kb-heading>
    </div>
  `,
};

export const Truncated: S = {
  render: () => html`
    <div style="max-width:300px;">
      <kb-heading level="3" truncate>This is a very long heading that should be truncated with an ellipsis when it exceeds the container width</kb-heading>
    </div>
  `,
};

export const PageHeader: S = {
  render: () => html`
    <div class="flex flex-col gap-1">
      <kb-heading level="1" weight="black">Dashboard</kb-heading>
      <kb-heading level="4" weight="medium" tone="secondary" size="md">Monitor your application metrics and performance</kb-heading>
    </div>
  `,
};

export const SectionHeaders: S = {
  render: () => html`
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <kb-heading level="2" weight="extrabold" tone="accent">Features</kb-heading>
        <div class="w-12 h-0.5 bg-blue-500"></div>
      </div>
      <div class="flex flex-col gap-2">
        <kb-heading level="2" weight="extrabold" tone="error">Breaking Changes</kb-heading>
        <div class="w-12 h-0.5 bg-red-500"></div>
      </div>
      <div class="flex flex-col gap-2">
        <kb-heading level="2" weight="extrabold" tone="success">Resolved</kb-heading>
        <div class="w-12 h-0.5 bg-green-500"></div>
      </div>
    </div>
  `,
};
