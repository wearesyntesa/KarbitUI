import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../../src/components/forms/kb-segment.js';

export default {
  title: 'Forms/Segment',
  component: 'kb-segment',
} satisfies Meta;

type S = StoryObj;

export const Default: S = {
  render: () => html`
    <kb-segment
      value="list"
      .options=${[
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
        { value: 'table', label: 'Table' },
      ]}
    ></kb-segment>
  `,
};

export const Sizes: S = {
  render: () => html`
    <div class="flex flex-col gap-6">
      <kb-segment size="xs" value="a" .options=${[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]}></kb-segment>
      <kb-segment size="sm" value="a" .options=${[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]}></kb-segment>
      <kb-segment size="md" value="a" .options=${[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]}></kb-segment>
      <kb-segment size="lg" value="a" .options=${[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]}></kb-segment>
      <kb-segment size="xl" value="a" .options=${[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]}></kb-segment>
    </div>
  `,
};

export const Disabled: S = {
  render: () => html`
    <kb-segment
      disabled
      value="list"
      .options=${[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
    ></kb-segment>
  `,
};

export const DisabledOption: S = {
  render: () => html`
    <kb-segment
      value="grid"
      .options=${[
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List', disabled: true },
        { value: 'table', label: 'Table' },
      ]}
    ></kb-segment>
  `,
};
